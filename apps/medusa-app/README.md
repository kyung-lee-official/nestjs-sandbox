# 鉴权

使用单个 jwt 完成鉴权。jwt 由 medusa 签发，通过 HttpOnly Cookie 存储, SameSite 设置为 Lax。

后端自定义 middleware 在请求到达 Store API/Admin API 之前验证 jwt, 将 token 从 cookie 中提取并复制到 headers.authorization 字段，向下传递。

前端通过 server action 调用 sign-in/sign-out api 完成登录登出操作， 验证当前登陆状态（token 是否过期）。

Jwt 刷新由后端中间件自动完成，无需前端参与。
