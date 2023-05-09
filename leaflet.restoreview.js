(function() {
    var RestoreViewMixin = {
        restoreView: function (version) {
            if (!storageAvailable('localStorage')) {
                return false;
            }
            var storage = window.localStorage;
            if (!this.__initRestore) {
                this.on('moveend', function (e) {
                    if (!this._loaded)
                        return;  // Never access map bounds if view is not set.

                    var view = {
                        lat: this.getCenter().lat,
                        lng: this.getCenter().lng,
                        zoom: this.getZoom(),
                        version: version,
                    };
                    storage['mapView'] = JSON.stringify(view);
                }, this);
                this.__initRestore = true;
            }

            var view = storage['mapView'];
            try {
                view = JSON.parse(view || '');
                if (view.version === version) {
                    this.setView(L.latLng(view.lat, view.lng), view.zoom, true);
                    return true;
                } else {
                    storage.removeItem('mapView');
                    return false;
                }
            }
            catch (err) {
                return false;
            }
        }
    };

    function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            console.warn("Your browser blocks access to " + type);
            return false;
        }
    }

    L.Map.include(RestoreViewMixin);
})();
