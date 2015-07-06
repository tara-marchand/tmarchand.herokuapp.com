var viewHelpers = {
    getHiddenClass: function() {
        'use strict';

        var hiddenClass = '';
        if (this.isBeingEdited === true) {
            hiddenClass = ' hidden';
        }
        return hiddenClass;
    }
};

module.exports = viewHelpers;