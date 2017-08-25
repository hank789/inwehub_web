export default {
    methods: {
        /* --------------------------------------------------------------------- */
        /* ---------------------------- Local Storage -------------------------- */
        /* --------------------------------------------------------------------- */

        /**
         * put the data into the localStorage
         *
         * @param string key
         * @param mixed value
         * @return void
         */
        putLS(key, value) {
            localStorage.setItem(auth.id + ":"+ key, JSON.stringify(value));
        },


        /**
         * fetches the data from the localStorage
         *
         * @param string key
         * @return object
         */
        getLS(key) {
            let result = JSON.parse(localStorage.getItem(auth.id + ":" + key));

            if (result === null) {
            	return []
            }

            return result
        },


        /**
         * is the value set into the local storage
         *
         * @param string key
         * @return boolean
         */
        isSetLS (key) {
            let prefixedKey = auth.id + ":" + key

            if (prefixedKey in localStorage) {
                return true
            }

            return false
        },


        forgetLS(key){
            let prefixedKey = auth.id + ":" + key

            localStorage.removeItem(prefixedKey);
        },


        /* --------------------------------------------------------------------- */
        /* --------------------------- Session Storage ------------------------- */
        /* --------------------------------------------------------------------- */

        /**
         * put the data into the sessionStorage
         *
         * @param string key
         * @param mixed value
         * @return void
         */
        putSS(key, value) {
            sessionStorage.setItem(auth.id + ":" + key, JSON.stringify(value));
        },


        /**
         * fetches the data from the sessionStorage
         *
         * @param string key
         * @return object
         */
        getSS(key) {
            let result = JSON.parse(sessionStorage.getItem(auth.id + ":" + key));

            if (result === null) {
            	return []
            }

            return result
        },


        /**
         * is the value set into the local storage
         *
         * @param string key
         * @return boolean
         */
        isSetSS (key) {
            let prefixedKey = auth.id + ":" + key

            if (prefixedKey in sessionStorage) {
                return true
            }

            return false
        },

        forgetSS(key){
            let prefixedKey = auth.id + ":" + key

            sessionStorage.removeItem(prefixedKey);
        }
    }
};
