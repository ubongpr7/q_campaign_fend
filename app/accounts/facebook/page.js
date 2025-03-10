"use client"; // Required for Next.js App Router (ensures client-side execution)

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FacebookLogin = () => {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    // Load Facebook SDK dynamically on the client side
    const loadFacebookSDK = () => {
      if (window.FB) return; // Prevent multiple loads

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "FACEBOOK_APP_ID", 
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
      };

      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error("Facebook SDK not loaded. Please try again.");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const token = response.authResponse.accessToken;
          setAccessToken(token);
          console.log("Facebook Access Token:", token);
        } else {
          toast.error("Facebook login failed or was cancelled.");
        }
      },
      { scope: "ads_management,ads_read,business_management,email,public_profile" }
    );
  };

  return (
    <div>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
      {accessToken && <p>Access Token: {accessToken}</p>}
    </div>
  );
};

export default FacebookLogin;