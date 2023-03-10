elasticsearch cluster資料分配不均時的解法。
查詢或是監控哪個node吃的index或容量特別多:
GET _cat/shards?v&s=index

移動index
POST /_cluster/reroute?metric=none
{
  "commands": [
    {
      "move": {
        "index": "logstash-2021.11.11-000011", "shard": 0,
        "from_node": "node-3", "to_node": "node-2"
      }
    }
  ]
}
