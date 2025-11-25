const firebaseConfig = {
  apiKey: "AIzaSyCb6by8ZysMCpjn_Dsprl8dysiipyx4-n0",
  authDomain: "onesignal-us.firebaseapp.com",
  databaseURL: "https://onesignal-us.firebaseio.com",
  projectId: "onesignal-us",
  storageBucket: "onesignal-us.firebasestorage.app",
  messagingSenderId: "957123064130",
  appId: "1:957123064130:web:c0ee8f9b8f07f3e5"
};

const getNotifyBasePath = () => {
    const fallbackPath = '/notify/1.0.0';
    if (typeof self.CURRENT_BASE_PATH !== 'undefined') {
        return self.CURRENT_BASE_PATH;
    }
    if (typeof document !== 'undefined' && document.currentScript) {
        try {
            const url = new URL(document.currentScript.src);
            return url.pathname.substring(0, url.pathname.lastIndexOf('/'));
        } catch (e) { }
    }
    return fallbackPath;
};

const getOrigin = () => {
    if (self && self.location) {
        return self.location.origin;
    }
    return '';
};

const HOST_ORIGIN = getOrigin();
const NOTIFY_BASE_PATH = getNotifyBasePath();

const PRODUCTION_API_ENDPOINT = 'https://notifyer.link/api/subscribe';
const EMULATOR_API_ENDPOINT = `${HOST_ORIGIN}/api/subscribe`;

const isEmulator = HOST_ORIGIN.includes('localhost') || HOST_ORIGIN.includes('127.0.0.1');

const CONFIG = {
    BASE_PATH: NOTIFY_BASE_PATH,
    VAPID_KEY: 'BNkJG6jwYSFOE5DsKzVRvXbD0SLlO2cpZFFfynDMqgTEHkgfAlDoPDAOo8ZvXH0fcW226cPEARHSMyRaMgndIHM',
    SCRIPT_PATHS: {
        CLIENT_MODULE: `${NOTIFY_BASE_PATH}/client.js`,
        INDEXDB_HELPER: `${NOTIFY_BASE_PATH}/idb-helper.js`,
    },
    API_ENDPOINT: isEmulator ? EMULATOR_API_ENDPOINT : PRODUCTION_API_ENDPOINT,
    MAX_PROMPT_ATTEMPTS: 5,
    MAX_PROMPT_INTVAL : 18,
    TOKEN_RENEWAL_DAYS: 32,
    STORAGE_KEYS: {
        PROMPT_ATTEMPTS: 'prompt_attempts',
        PROMPT_LAST_SHOWN_AT: 'prompt_last_shown_at',
        FCM_TOKEN: 'fcm_token',
        SUBSCRIPTION_ID: 'subscription_id',
        PROMPT_SHOWN_IN_SESSION: 'prompt_shown_in_session',
        SYNC_CHECKED_IN_SESSION: 'sync_checked_in_session',
        SUPPRESS_PROMPT_ONCE: 'suppress_prompt_once',
        BROWSER_SUPPORT_STATUS: 'browser_support_status',
        SUBSCRIBED_AT_TIMESTAMP: 'subscribed_at_timestamp',
        IS_USER_CLEARED_IN_PAST: 'is_user_cleared_in_past',
        IS_ADMIN: 'is_admin',
    },
    TOKEN_TYPES: {
        FRESHER: 'fresher',
        REENTER: 'reenter',
        UPGRADE: 'upgrade',
        RESTORE: 'restore',
        CLEARED: 'cleared',
        RENEWAL: 'renewal',
        REFRESH: 'refresh',
    },
    ANALYTICS_EVENTS: {
        PERMISSION: 'permission',
        LIFECYCLE: 'lifecycle',
        ENGAGEMENT: 'engagement',
        CATEGORY: 'Notification',
    },
    PROMPT_DELAY_SECONDS: 10,
    UI_TEXT: {
        REQUEST_PROMPT: {
            text: 'क्या आप सभी अपडेट और रिजल्ट सीधे अपने मोबाईल / डिवाइस पर पाना चाहते है?',
            confirmButtonText: 'हाँ, मुझे सूचित करें',
            cancelButtonText: 'नहीं, फिर कभी',
        },
    },
    WELCOME_NOTIFICATION: {
        title: 'सब्सक्रिप्शन सफल रहा!',
        body: 'अब आपको सभी अपडेट और रिजल्ट सीधे आपके डिवाइस पर मिलेंगे।',
        icon: `${HOST_ORIGIN}${NOTIFY_BASE_PATH}/icon.png`,
        url: `${HOST_ORIGIN}/?utm_source=notify&utm_medium=welcome&utm_campaign=verify_welcome&track_click=verify_welcome`,
        timer: 4000
    }
};

(function loadModules() {
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    if (!isBrowser) {
        return;
    }

    try {
        const helperScript = document.createElement('script');
        helperScript.type = 'text/javascript';
        helperScript.src = `${CONFIG.SCRIPT_PATHS.INDEXDB_HELPER}`;
        document.body.appendChild(helperScript);

        const clientScript = document.createElement('script');
        clientScript.type = 'module';
        clientScript.src = `${CONFIG.SCRIPT_PATHS.CLIENT_MODULE}`;
        document.body.appendChild(clientScript);
    } catch (error) {
        console.error("Failed to dynamically load modules from config.js:", error);
    }
})();