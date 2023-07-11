# TODO list

- Versioning, region, namespace on kustomize files
- Trigger
- Load Balancer delete (Kubectl delete -k ...)
 
---

## Errors to investigate

### Error on apply tf-env
```
╷
│ Error: 400-InvalidParameter, Invalid nodeSourceDetails.imageId: Node image not supported.
│ Suggestion: Please update the parameter(s) in the Terraform config as per error message Invalid nodeSourceDetails.imageId: Node image not supported.
│ Documentation: https://registry.terraform.io/providers/oracle/oci/latest/docs/resources/containerengine_node_pool 
│ API Reference: https://docs.oracle.com/iaas/api/#/en/containerengine/20180222/NodePool/CreateNodePool 
│ Request Target: POST https://containerengine.eu-madrid-1.oci.oraclecloud.com/20180222/nodePools 
│ Provider version: 4.123.0, released on 2023-05-31. This provider is 3 Update(s) behind to current. 
│ Service: Containerengine Node Pool 
│ Operation Name: CreateNodePool 
│ OPC request ID: e034e107d9d6c41c1653c789a99b2742/E11E68FA3032EC1BB8FCB40FD0D529B4/030CDEC9C9BE89E79DB4D1168ECC89AB 
│ 
│ 
│   with module.oke-quickstart.module.oke_node_pools["pool1"].oci_containerengine_node_pool.oke_node_pool[0],
│   on .terraform/modules/oke-quickstart/modules/oke-node-pool/main.tf line 7, in resource "oci_containerengine_node_pool" "oke_node_pool":
│    7: resource "oci_containerengine_node_pool" "oke_node_pool" {
```

### Error on destroy on tf-env:
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