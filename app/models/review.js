
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    comment: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    reviewee: DataTypes.INTEGER,
    reviewer: DataTypes.INTEGER,
  });
  // Review.associate = (models) => {
  //   Review.belongsTo(models.User, {
  //     foreignKey: 'id_reviewee',
  //     as: 'reviewee', // the id of the user being reviewed
  //   });
  //   Review.belongsTo(models.User, {
  //     foreignKey: 'id_reviewer',
  //     as: 'reviewer', // the id of the user giving the review
  //   });
  // };

  return Review;
};
