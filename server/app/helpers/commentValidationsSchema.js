const commentSchema={
body:{
    notEmpty:{errorMessage:'Comment Body is required'}
}
}
module.exports=commentSchema