const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    // Check for Multer error
    if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error_msg', 'File size is too large. Max limit is 5MB.');
        return res.redirect('back');
    }

    if (typeof err === 'string') {
        req.flash('error_msg', err);
        return res.redirect('back');
    }

    res.status(500).render('error/404', { title: 'Internal Server Error' });
};

module.exports = errorMiddleware;
