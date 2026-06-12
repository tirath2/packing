"use client";

import { useEffect } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDAawjXzeJTxBdTnT7s3nMjJrCt_aDiGmU",
  authDomain: "packing-1e95c.firebaseapp.com",
  projectId: "packing-1e95c",
  storageBucket: "packing-1e95c.firebasestorage.app",
  messagingSenderId: "1089680949573",
  appId: "1:1089680949573:web:9747d58f2e429d84c0be2c",
  measurementId: "G-YE6WSY328S",
};

export function FirebaseAnalytics() {
  useEffect(() => {
    let mounted = true;

    isSupported()
      .then((supported) => {
        if (!mounted || !supported) {
          return;
        }

        const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        getAnalytics(app);
      })
      .catch(() => {
        // Analytics can be unavailable in private browsing, unsupported browsers,
        // or local test environments. The site should continue rendering normally.
      });

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
