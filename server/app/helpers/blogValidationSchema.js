const blogValidationSchema={
title:{
    notEmpty:{errorMessage:'Title must not be empty'}
},
content:{
    notEmpty:{errorMessage:'Content must not be empty'}
}
}

module.exports=blogValidationSchema