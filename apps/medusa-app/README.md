# 鉴权

使用单个 jwt 完成鉴权。jwt 由 medusa 签发，通过 HttpOnly Cookie 存储 (cookie key `medusa_token`), SameSite 设置为 Lax

后端自定义 middleware 在请求到达 Store API/Admin API 之前验证 jwt, 将 token 从 cookie 中提取并复制到 headers.authorization 字段，向下传递

前端通过:

* 由于 medusa 内置鉴权接口 ~~`POST /auth/{actor_type}/{auth_provider}`~~ 会将 token 以 json 格式返回，且不会设置 HttpOnly Cookie，因此弃用该接口，改为使用自定义 API `POST /auth/sign-in/{actor_type}/{auth_provider}` 完成登录，登录成功后，后端设置 HttpOnly Cookie 存储 jwt
* `GET /store/customers/me` 获取当前登录用户信息，存储在 zustand store 中（浏览器内存，非持久化）
* 自定义 API `DELETE /auth/sign-out` 清空 cookies， 并清空 zustand store 完成登出

Jwt 刷新由后端中间件 decode 后查验剩余时间自动完成，无需前端参与
