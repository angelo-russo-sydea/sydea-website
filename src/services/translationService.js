import React, { Component} from 'react';

const appOwner = process.env.REACT_APP_OWNER;

export default class TranslationsService extends Component {
  constructor(props) {
    super(props);
    this.labelsList = {};
    this.mainStyle = {};
    this.language = 'en';
    // this.language = appOwner === 'indastria' ? 'it' : 'en';
    // this.language = localStorage.getItem("syd_langu") ? localStorage.getItem("syd_langu") : 'en';
    // this.language = navigator.language.startsWith('it') ? 'it' : 'en';
  }

  setLanguageFromRouter(lang) {
    // if (lang === 'it' || lang === 'en') {
    //   this.language = lang;
    // } else {
    //   this.language = 'en';
    // }
    const chosen = (lang === 'it' || lang === 'en') ? lang : 'en';
    this.language = chosen;
    localStorage.setItem('syd_langu', chosen);
  }

  setLabelsList(_labelsList){
    this.labelsList = _labelsList;
  }
  
  // setMainDataStyle(_data){
  //   this.mainStyle = _data;
    
  //   document.documentElement.style.setProperty('--brand-color-main', this.mainStyle.style.brandColors.main);
  //   document.documentElement.style.setProperty('--brand-color-secondary', this.mainStyle.style.brandColors.secondary);
  //   document.documentElement.style.setProperty('--brand-color-details', this.mainStyle.style.brandColors.details);

  //   document.documentElement.style.setProperty('--light-mode-title', this.mainStyle.style.lightMode.title);
  //   document.documentElement.style.setProperty('--light-mode-text', this.mainStyle.style.lightMode.text);
  //   document.documentElement.style.setProperty('--light-mode-background', this.mainStyle.style.lightMode.background);
  //   document.documentElement.style.setProperty('--light-mode-btn-background', this.mainStyle.style.lightMode.btnBackground);
  //   document.documentElement.style.setProperty('--light-mode-btn-text', this.mainStyle.style.lightMode.btnText);

  //   document.documentElement.style.setProperty('--dark-mode-title', this.mainStyle.style.darkMode.title);
  //   document.documentElement.style.setProperty('--dark-mode-text', this.mainStyle.style.darkMode.text);
  //   document.documentElement.style.setProperty('--dark-mode-background', this.mainStyle.style.darkMode.background);
  //   document.documentElement.style.setProperty('--dark-mode-btn-background', this.mainStyle.style.darkMode.btnBackground);
  //   document.documentElement.style.setProperty('--dark-mode-btn-text', this.mainStyle.style.darkMode.btnText);

  // }

  setMainDataStyle(_data) {
    this.mainStyle = _data;
  
    const existingStyle = document.getElementById('dynamic-theme-vars');
    if (existingStyle) {
      existingStyle.remove();
    }
  
    const style = document.createElement('style');
    style.id = 'dynamic-theme-vars';
  
    const vars = {
      '--brand-color-main': this.mainStyle.style.brandColors.main,
      '--brand-color-secondary': this.mainStyle.style.brandColors.secondary,
      '--brand-color-details': this.mainStyle.style.brandColors.details,
  
      '--light-mode-title': this.mainStyle.style.lightMode.title,
      '--light-mode-text': this.mainStyle.style.lightMode.text,
      '--light-mode-background': this.mainStyle.style.lightMode.background,
      '--light-mode-btn-background': this.mainStyle.style.lightMode.btnBackground,
      '--light-mode-btn-text': this.mainStyle.style.lightMode.btnText,
  
      '--dark-mode-title': this.mainStyle.style.darkMode.title,
      '--dark-mode-text': this.mainStyle.style.darkMode.text,
      '--dark-mode-background': this.mainStyle.style.darkMode.background,
      '--dark-mode-btn-background': this.mainStyle.style.darkMode.btnBackground,
      '--dark-mode-btn-text': this.mainStyle.style.darkMode.btnText
    };
  
    let css = ':root {\n';
    for (const [key, value] of Object.entries(vars)) {
      css += `  ${key}: ${value};\n`;
    }
    css += '}';
  
    style.innerHTML = css;
    document.head.appendChild(style);
  }
  

  setLanguage(selectedLangu){
    if(localStorage.getItem("syd_langu") === selectedLangu){
      return;
    }
    localStorage.setItem("syd_langu", selectedLangu);
    window.location.reload(true);
  }

  getCurrentLanguage(){
    return this.language;
  }

  // labels(arrayLabel) {
  //   try{
  //     let _listLbl = '';
  //     let _arraySplit = arrayLabel.split('.');
  //     for (let i = 0; i < _arraySplit.length; i++) {
  //       _listLbl += `['${_arraySplit[i]}']`;
  //     }
  //     return eval(`this.labelsList['${this.language}']${_listLbl}`);
  //   }
  //   catch(err){
  //     return '';
  //   }
  // }

  labels(arrayLabel) {
    const keys = arrayLabel.split('.');
    return keys.reduce((obj, key) => obj?.[key], this.labelsList[this.language]) || '';
    // return eval(`this.labelsList['${this.language}']${_listLbl}`);
  }

  availableLanguages(){
    return Object.keys(this.labelsList);
  }

  getGlobalValue(_val){
    try{
      return eval(`this.labelsList['_global']['${_val}']`);
    }
    catch(err){
      return '';
    }
  }

  getMainColors(){
    try{
      return eval(`this.labelsList['_global']['color']`);
    }
    catch(err){
      return {};
    }
  }

  getMainInfoCompany(_val){
    try{
      return eval(`this.mainStyle['mainInfo']['${_val}']`);
    }
    catch(err){
      return {};
    }
  }

  sectionAvailable(_val){
    try{
      return eval(`this.mainStyle['mainSections']['${_val}']`);
    }
    catch(err){
      return '';
    }
  }

  childMenuAvailable(val){
    try{
      let _listLbl = '';
      let _arraySplit = val.split('.');
      for (let i = 0; i < _arraySplit.length; i++) {
        _listLbl += `['${_arraySplit[i]}']`;
      }
      return eval(`this.mainStyle${_listLbl}`);
    }
    catch(err){
      return '';
    }
  }

  itemFooter(_val){
    try{
      let _listLbl = '';
      let _arraySplit = _val.split('.');
      for (let i = 0; i < _arraySplit.length; i++) {
        _listLbl += `['${_arraySplit[i]}']`;
      }
      return eval(`this.mainStyle['footer']${_listLbl}`);
    }
    catch(err){
      return '';
    }
  }

  getOffice(){
    return this.mainStyle.offices;
  }

  getMailTemaplateContact(){
    return this.mainStyle.mailForm;
  }

  getMailTemaplateCareers(){
    return this.mainStyle.mailFormCareers;
  }

  showContactFormCareers(){
    return this.mainStyle.contactForms.showContactFormCareers;
  }

  showContactFormMain(){
    return this.mainStyle.contactForms.showContactFormMain;
  }

  getLinkCookieAndPrivacy(_val){
    if(_val === 'privacy'){
      return this.mainStyle.privacySections.privacyPolicyLink;
    }
    else if (_val === 'cookie'){
      return this.mainStyle.privacySections.cookiePolicyLink;
    }
  }

  getEmployeeMenu(){
    return this.mainStyle.employee_menu;
  }

  setPrivacyPreference(){

  }

  isShowCookie(){
    try{
      return this.mainStyle.privacySections.showCookie;
    }
    catch(e){
      return false;
    }
  }

  getCookieBannerText(){
    return this.mainStyle.privacySections.cookieText;
  }

}

export const translationsServiceInstance = new TranslationsService();