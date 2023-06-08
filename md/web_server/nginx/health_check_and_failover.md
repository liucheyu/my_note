## 健康檢查及故障轉移

目的:

1. 可使用 crontab 定期訪問 cluster 的/healthcheck 接口，檢查哪個 api 可用，可用就放入 lua dict 內，
   訪問其他路徑時，就從 lua dia 內取出路徑，搭配輪詢策略，設定 nginx 的變數，
   然後執行走訪，proxy pass 至這個變數值

2. 當走訪路徑返回錯誤時，重新定向嘗試 lua dict 存的路徑中的其他 api，最後沒有可用節點時，返回錯誤

_nginx config_

```code
http {
    lua_shared_dict healthcheck_results 1m;

    upstream backend {
        server backend1:8080;
        server backend2:8080;
        server backend3:8080;
    }

    server {
        listen 80;

        location /healthcheck {
            internal;
            default_type 'text/plain';

            content_by_lua_block {
                local http = require "resty.http"
                local httpc = http.new()
                local nodes = {
                    { "backend1", 8080 },
                    { "backend2", 8080 },
                    { "backend3", 8080 }
                }

                local available_nodes = {}

                for _, node in ipairs(nodes) do
                    local res, err = httpc:request_uri("http://" .. node[1] .. ":" .. node[2] .. "/health", { method = "GET" })

                    if res and res.status == 200 then
                        table.insert(available_nodes, node)
                    end
                end

                ngx.shared.healthcheck_results:set("available_nodes", table.concat(available_nodes, ";"))
            }
        }

        location / {
            access_by_lua_block {
                local available_nodes_str = ngx.shared.healthcheck_results:get("available_nodes")

                if available_nodes_str then
                    local available_nodes = {}

                    for node in string.gmatch(available_nodes_str, "[^;]+") do
                        local parts = {}

                        for part in string.gmatch(node, "[^:]+") do
                            table.insert(parts, part)
                        end

                        table.insert(available_nodes, parts)
                    end

                    if #available_nodes > 0 then
                        local target_node_index = ngx.ctx.target_node_index or 0
                        target_node_index = (target_node_index % #available_nodes) + 1
                        ngx.ctx.target_node_index = target_node_index

                        local target_node = available_nodes[target_node_index]

                        -- 将请求代理到目标节点
                        ngx.var.target_node = target_node[1] .. ":" .. target_node[2]
                        ngx.exec("@backend")
                    end
                end

                -- 如果没有可用节点或请求失败，则重定向到其他可用节点
                return ngx.redirect("@redirect");
            }
        }

        location @backend {
            proxy_pass http://$target_node;
        }

        location @redirect {
            error_page 502 = @backend_retry;
            return 502;
        }

        location @backend_retry {
            access_by_lua_block {
                local available_nodes_str = ngx.shared.healthcheck_results:get("available_nodes")

                if available_nodes_str then
                    local available_nodes = {}

                    for node in string.gmatch(available_nodes_str, "[^;]+") do
                        local parts = {}

                        for part in string.gmatch(node, "[^:]+") do
                            table.insert(parts, part)
                        end

                        table.insert(available_nodes, parts)
                    end

                    -- 遍历所有节点进行健康检查
                    for i, node in ipairs(available_nodes) do
                        local http = require "resty.http"
                        local httpc = http.new()
                        local res, err = httpc:request_uri("http://" .. node[1] .. ":" .. node[2] .. "/health", { method = "GET" })

                        if res and res.status == 200 then
                            -- 找到一个可用节点，将请求代理到该节点
                            ngx.var.target_node = node[1] .. ":" .. node[2]
                            ngx.exec("@backend")
                            return
                        end
                    end
                end

                -- 没有可用节点，返回服务不可用状态
                return ngx.HTTP_SERVICE_UNAVAILABLE
   -- 没有可用节点，重定向到静态 HTML 页面
	    #return ngx.redirect("/error.html")

            }
        }
    }
}

```

_crontab_

```crontab
* * * * * curl -X GET http://localhost/healthcheck >/dev/null 2>&1
```
