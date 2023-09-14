import I18n from "src/locale/index";

export default ({ app }) => {
  const i18n = I18n;
  app.use(i18n);
};
