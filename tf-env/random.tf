resource "random_string" "deploy_id" {
  length  = 4
  special = false
}

resource "random_string" "web_auth_token" {
  length  = 32
  special = false
}
