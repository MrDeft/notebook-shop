module.exports = function(req, res, next) {
    res.status(404).render('notfound', {
        title: 'Error 404 Not Found'
    })
}