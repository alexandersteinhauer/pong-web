const url = "https://localhost:4433";

function addMessage(text, type) {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = `[${type.toUpperCase()}] ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function init() {
  const transport = new WebTransport(url, {
    serverCertificateHashes: [
      {
        algorithm: "sha-256",
        value: Uint8Array.from(
          atob("eode/DS1WZRnplL5G82Oqxyvdx/DoUOy5tbqKz5ee1c="),
          (c) => c.charCodeAt(0)
        ),
      },
    ],
  });

  await transport.ready;
  console.log("WebTransport ready");
  addMessage("Connected to server!", "received");

  const sender = transport.datagrams.writable.getWriter();
  const reader = transport.datagrams.readable.getReader();

  // Listen for incoming datagrams
  (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const text = new TextDecoder().decode(value);
      console.log("Received:", text);
      addMessage(text, "received");
    }
  })();

  document.getElementById("send").onclick = async () => {
    const message = "Hello from WebTransport!";
    const data = new TextEncoder().encode(message);
    await sender.write(data);
    console.log("Datagram sent:", message);
    addMessage(message, "sent");
  };
}

init().catch((err) => {
  console.error("WebTransport connection failed:", err);
  addMessage(`Connection failed: ${err.message}`, "error");
});
