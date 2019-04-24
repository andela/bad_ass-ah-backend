const reportTypeModel = (sequelize, DataTypes) => {
  const ReportType = sequelize.define('reportType', {
    type: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  ReportType.associate = (models) => {
    ReportType.hasMany(models.reportArticle, { foreignKey: 'reportTypeId', allowNull: false });
  };
  return ReportType;
};

export default reportTypeModel;
