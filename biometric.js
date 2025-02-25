document.addEventListener("DOMContentLoaded", () => {
  const biometricButton = document.createElement("button");
  biometricButton.textContent = "Register with Biometrics";
  biometricButton.style.position = "fixed";
  biometricButton.style.top = "10px";
  biometricButton.style.right = "10px";
  biometricButton.style.zIndex = "1001";
  document.body.appendChild(biometricButton);

  biometricButton.addEventListener("click", async () => {
    if (!window.PublicKeyCredential) {
      alert("Biometric authentication is not supported on this browser.");
      return;
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const publicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: { name: "Book Log App" },
      user: {
        id: userId,
        name: "user@example.com",
        displayName: "User Example",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      timeout: 60000,
      attestation: "none",
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      console.log("Credential created:", credential);
      alert("Biometric registration successful!");
    } catch (err) {
      console.error("Error during biometric registration:", err);
      alert("Biometric registration failed.");
    }
  });

  const loginButton = document.createElement("button");
  loginButton.textContent = "Login with Biometrics";
  loginButton.style.position = "fixed";
  loginButton.style.top = "50px";
  loginButton.style.right = "10px";
  loginButton.style.zIndex = "1001";
  document.body.appendChild(loginButton);

  loginButton.addEventListener("click", async () => {
    if (!window.PublicKeyCredential) {
      alert("Biometric authentication is not supported on this browser.");
      return;
    }

    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions = {
      challenge: challenge,
      timeout: 60000,
      allowCredentials: [
        {
          type: "public-key",
          id: new Uint8Array(16),
        },
      ],
      userVerification: "preferred",
    };

    try {
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });
      console.log("Credential retrieved:", credential);
      alert("Biometric login successful!");
    } catch (err) {
      console.error("Error during biometric login:", err);
      alert("Biometric login failed.");
    }
  });
});
