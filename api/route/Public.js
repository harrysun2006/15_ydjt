exports.about = function(req, res, next) {
	res.status(200).send({author: 'Harry Sun (harrysun2006@gmail.com)', version: '0.0.1'});
};
