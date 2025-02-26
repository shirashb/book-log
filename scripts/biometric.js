import { db } from "../firebase/firebaseConfig.js";
import {
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");

  if (registerButton) {
    registerButton.addEventListener("click", async () => {
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

        const userCredentialRef = doc(
          db,
          "biometricCredentials",
          userId.toString()
        );
        await setDoc(userCredentialRef, {
          credentialId: credential.id,
          userId: userId.toString(),
          createdAt: new Date(),
        });

        alert("Biometric registration successful!");
      } catch (err) {
        console.error("Error during biometric registration:", err);
        alert("Biometric registration failed.");
      }
    });
  }

  if (loginButton) {
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

        const userCredentialRef = doc(
          db,
          "biometricCredentials",
          credential.id
        );
        const docSnap = await getDoc(userCredentialRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("User data:", userData);
          alert("User authenticated successfully!");
        } else {
          console.log("No matching credentials found.");
          alert("Authentication failed.");
        }
      } catch (err) {
        console.error("Error during biometric login:", err);
        alert("Biometric login failed.");
      }
    });
  }
});
