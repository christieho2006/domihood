# DOMIHOOD 昵称 + 密码账号

## 已实现的应用端能力

- 昵称注册、登录、退出和当前会话查询 API。
- 密码使用 bcrypt 哈希保存，不保存明文密码。
- 登录态放在 HttpOnly、SameSite=Lax Cookie 中，服务端签名并设置过期时间。
- 账号表启用 RLS，不给浏览器角色开放直接读写权限。
- 昵称长度为 2–16 个字符，支持中文、字母、数字、下划线和连字符；密码长度为 8–72 个字符。
- 浏览器仍可使用访客模式；访客昵称只保存在当前设备。

## 启用前必须完成的配置

1. 在 Supabase SQL Editor 依次执行 `supabase/migrations/202610120001_domi_accounts.sql` 与 `supabase/migrations/202610120002_domi_cottage_layouts.sql`。
2. 在部署平台服务器端配置环境变量：
   - `SUPABASE_URL`（或已有的 `NEXT_PUBLIC_SUPABASE_URL`）
   - `SUPABASE_SERVICE_ROLE_KEY`（仅服务器端，绝不能使用 `NEXT_PUBLIC_` 前缀）
   - `SESSION_SECRET`（至少 32 个随机字符，建议使用密码管理器生成）
3. 确认 EdgeOne Pages 当前项目支持 Next.js Node.js Route Handlers / Node.js runtime，并将以上环境变量配置到需要部署的环境。
4. 重新部署后验证注册、退出、登录、会话过期和错误提示。

## 安全注意事项

- 不要把服务角色密钥或 SESSION_SECRET 写进代码仓库或发到聊天中。
- 不要把昵称或 localStorage 当作已登录身份；只有通过服务端签名 Cookie 才算已登录。
- 正式公开注册前，建议增加持久化速率限制 / 防滥用措施和密码重置流程。
- 当前账号 API 不会自动把旧访客昵称升级为账号，也不会在注册时覆盖本地小屋布局。
- 跨设备云端装修同步尚未接入；需要在认证配置验证后，再为每个账号建立独立布局记录和访问策略。
