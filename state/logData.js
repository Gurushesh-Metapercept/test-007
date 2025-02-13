let userLogData = [];

function getLogData() {
  return userLogData;
}

function addLogData(type, message) {
  userLogData.push({ type, message });
}

function clearLogData() {
  userLogData = [];
}

module.exports = {
  addLogData,
  getLogData,
  clearLogData,
};
