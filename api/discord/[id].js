export default async function handler(req, res) {
  const { id } = req.query;

  if (!/^\d{17,20}$/.test(id)) {
    return res.status(400).json({ error: "Invalid Discord ID" });
  }

  const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
    }
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Discord lookup failed" });
  }

  const user = await response.json();

  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(user.id) % 5n)}.png`;

  res.status(200).json({
    id: user.id,
    username: user.username,
    global_name: user.global_name,
    avatar_url: avatar
  });
}
