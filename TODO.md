# TODO list

- Trigger
- Native deployment
- Rollback

Error on clean up `tf-env`:
```
Error: Unsupported attribute
│ 
│   on .terraform/modules/oke-quickstart/main.tf line 278, in locals:
│  278:           network_entity_id = module.gateways.nat_gateway_id
│     ├────────────────
│     │ module.gateways is object with 1 attribute "local_peering_gateway_id"
│ 
│ This object does not have an attribute named "nat_gateway_id".
╵
╷
│ Error: Unsupported attribute
│ 
│   on .terraform/modules/oke-quickstart/main.tf line 284, in locals:
│  284:           network_entity_id = module.gateways.service_gateway_id
│     ├────────────────
│     │ module.gateways is object with 1 attribute "local_peering_gateway_id"
│ 
│ This object does not have an attribute named "service_gateway_id".
╵
╷
│ Error: Unsupported attribute
│ 
│   on .terraform/modules/oke-quickstart/main.tf line 296, in locals:
│  296:           network_entity_id = module.gateways.internet_gateway_id
│     ├────────────────
│     │ module.gateways is object with 1 attribute "local_peering_gateway_id"
│ 
│ This object does not have an attribute named "internet_gateway_id".
```