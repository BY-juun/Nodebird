module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post',{
        content : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
    },{
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci',//한글 + 이모티콘
    });

    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image); //post.addImages
        db.Post.belongsTo(db.Post,{as : 'Retweet'}); //RetweetId사용
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); 
        db.Post.belongsToMany(db.User,{through : 'Like', as : 'Likers'}); //post.addLikers( )생김
    };
    return Post;
}