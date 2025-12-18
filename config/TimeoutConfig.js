/**
 * Timeout Configuration
 * Reads timeout values from environment variables with fallback defaults
 * Values can be overridden via .env file
 */
export default {
  // Page load timeouts
  PAGE_LOAD: parseInt(process.env.PAGE_LOAD_TIMEOUT) || 90000,
  NETWORK_IDLE: parseInt(process.env.NETWORK_IDLE_TIMEOUT) || 30000,

  // Element interaction timeouts
  ELEMENT_VISIBILITY: parseInt(process.env.ELEMENT_VISIBILITY_TIMEOUT) || 10000,
  SHORT_WAIT: parseInt(process.env.SHORT_WAIT_TIMEOUT) || 200,
  MEDIUM_WAIT: parseInt(process.env.MEDIUM_WAIT_TIMEOUT) || 300,
  LONG_WAIT: parseInt(process.env.LONG_WAIT_TIMEOUT) || 500,
  EXTRA_LONG_WAIT: parseInt(process.env.EXTRA_LONG_WAIT_TIMEOUT) || 1000,

  // Form interaction timeouts
  FORM_FIELD: parseInt(process.env.FORM_FIELD_TIMEOUT) || 200,
  FORM_SUBMIT: parseInt(process.env.FORM_SUBMIT_TIMEOUT) || 500,
  FORM_DROPDOWN: parseInt(process.env.FORM_DROPDOWN_TIMEOUT) || 300,
  FORM_STATE_CITY: parseInt(process.env.FORM_STATE_CITY_TIMEOUT) || 1000,

  // Tooltip and hover timeouts
  TOOLTIP: parseInt(process.env.TOOLTIP_TIMEOUT) || 5000,

  // Select menu timeouts
  SELECT_MENU: parseInt(process.env.SELECT_MENU_TIMEOUT) || 500,
  SELECT_MENU_OPTION: parseInt(process.env.SELECT_MENU_OPTION_TIMEOUT) || 300,
  SELECT_MENU_MULTI: parseInt(process.env.SELECT_MENU_MULTI_TIMEOUT) || 1000,
};

