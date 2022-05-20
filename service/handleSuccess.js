const handleSuccess = (res, data) => {
  res.send({
    status: 'success',
    data
  }).end();
}

module.exports = handleSuccess;