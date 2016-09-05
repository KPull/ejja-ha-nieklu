module.exports = function() {

    var isEmpty = function (text) {
        return !text || text === '';
    };

    return {
        isEmpty: isEmpty
    }

}();