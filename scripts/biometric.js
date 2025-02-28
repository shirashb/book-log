import { db, auth, signInAnonymously } from "../firebase/firebaseConfig.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.getElementById("register-button");
  const loginButton = document.getElementById("login-button");

  if (!window.PublicKeyCredential) {
    alert(
      "Your browser does not support WebAuthn. Please update your browser."
    );
    return;
  }

  registerButton.addEventListener("click", async () => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credentials = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "Book Log App" },
          user: {
            id: new Uint8Array(16),
            name: "user@example.com",
            displayName: "User",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { authenticatorAttachment: "platform" },
          timeout: 60000,
        },
      });

      if (credentials) {
        localStorage.setItem(
          "credentialId",
          btoa(String.fromCharCode(...new Uint8Array(credentials.rawId)))
        );

        alert("Biometric registration successful!");
      }
    } catch (error) {
      console.error("Biometric registration failed:", error);
      alert("Failed to register biometrics.");
    }
  });

  loginButton.addEventListener("click", async () => {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const storedCredentialId = localStorage.getItem("credentialId");

      const credentials = await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: storedCredentialId
            ? [
                {
                  id: Uint8Array.from(atob(storedCredentialId), (c) =>
                    c.charCodeAt(0)
                  ),
                  type: "public-key",
                },
              ]
            : [],
          timeout: 60000,
          userVerification: "required",
          authenticatorSelection: {
            authenticatorAttachment: "platform",
          },
        },
      });

      if (credentials) {
        sessionStorage.setItem("authenticated", "true");
        alert("Login successful!");
        document.getElementById("main-content").style.display = "block";

        signInAnonymously(auth)
          .then(() => {
            const user = auth.currentUser;
            const userRef = doc(db, "users", user.uid);

            getDoc(userRef)
              .then((docSnapshot) => {
                if (!docSnapshot.exists()) {
                  setDoc(userRef, {
                    name: "User",
                    email: "user@example.com",
                    registeredAt: new Date(),
                    preferences: { theme: "dark", notifications: true },
                  })
                    .then(() => {
                      console.log("New user data created in Firestore.");
                    })
                    .catch((error) => {
                      console.error("Error creating user in Firestore:", error);
                    });
                } else {
                  console.log("User already exists in Firestore.");
                }
              })
              .catch((error) => {
                console.error("Error checking user data in Firestore:", error);
              });
          })
          .catch((error) => {
            console.error("Firebase authentication failed:", error);
          });
      } else {
        throw new Error("Biometric authentication failed");
      }
    } catch (error) {
      console.error("Biometric login failed:", error);
      alert(`Failed to authenticate with biometrics: ${error.message}`);
    }
  });

  if (!sessionStorage.getItem("authenticated")) {
    document.getElementById("main-content").style.display = "none";
    alert("Please log in using biometrics.");
  }
});
