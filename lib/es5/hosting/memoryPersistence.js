"use strict";
"use strict";
var StrMap = require("backpack-node").collections.StrMap;
var Guid = require("guid");
require('date-utils');
var specStrings = require("../common/specStrings");
var InstIdPaths = require("./instIdPaths");
var is = require("../common/is");
function MemoryPersistence(log) {
  this._instanceData = new StrMap();
  this._locksById = new StrMap();
  this._locksByName = new StrMap();
  this._log = log === true;
}
MemoryPersistence.prototype.enterLock = function(lockName, inLockTimeoutMs) {
  if (this._log) {
    console.log("enterLock(" + lockName + ", " + inLockTimeoutMs + ");\n");
  }
  var now = new Date();
  var cLock = this._locksByName.get(lockName);
  if (is.undefined(cLock) || cLock.heldTo.compareTo(now) === -1) {
    var lockInfo = {
      id: Guid.create().toString(),
      name: lockName,
      heldTo: new Date().addMilliseconds(inLockTimeoutMs)
    };
    this._locksById.set(lockInfo.id, lockInfo);
    this._locksByName.set(lockInfo.name, lockInfo);
    return lockInfo;
  }
  return null;
};
MemoryPersistence.prototype.renewLock = function(lockId, inLockTimeoutMs) {
  if (this._log) {
    console.log("renewLock(" + lockId + ", " + inLockTimeoutMs + ");\n");
  }
  var cLock = this._getLockById(lockId);
  cLock.heldTo = new Date().addMilliseconds(inLockTimeoutMs);
};
MemoryPersistence.prototype.exitLock = function(lockId) {
  if (this._log) {
    console.log("exitLock(" + lockId + ");\n");
  }
  var cLock = this._getLockById(lockId);
  this._locksByName.remove(cLock.name);
  this._locksById.remove(cLock.id);
};
MemoryPersistence.prototype._getLockById = function(lockId) {
  var cLock = this._locksById.get(lockId);
  var now = new Date();
  if (!cLock || now.compareTo(cLock.heldTo) > 0) {
    throw new Error("Lock by id '" + lockId + "' doesn't exists.");
  }
  return cLock;
};
MemoryPersistence.prototype.isRunning = function(workflowName, instanceId) {
  if (this._log) {
    console.log("isRunning(" + workflowName + ", " + instanceId + ");\n");
  }
  return this._instanceData.containsKey(specStrings.hosting.doubleKeys(workflowName, instanceId));
};
MemoryPersistence.prototype.persistState = function(state) {
  if (this._log) {
    console.log("persistState(" + state.workflowName + ", " + state.instanceId + ");\n");
  }
  this._instanceData.set(specStrings.hosting.doubleKeys(state.workflowName, state.instanceId), state);
};
MemoryPersistence.prototype.getRunningInstanceIdHeader = function(workflowName, instanceId) {
  if (this._log) {
    console.log("getRunningInstanceIdHeader(" + workflowName + ", " + instanceId + ");\n");
  }
  var state = this._loadState(workflowName, instanceId);
  return {
    updatedOn: state.updatedOn,
    workflowVersion: state.workflowVersion
  };
};
MemoryPersistence.prototype.loadState = function(workflowName, instanceId) {
  if (this._log) {
    console.log("loadState(" + workflowName + ", " + instanceId + ");\n");
  }
  return this._loadState(workflowName, instanceId);
};
MemoryPersistence.prototype.removeState = function(workflowName, instanceId) {
  if (this._log) {
    console.log("removeState(" + workflowName + ", " + instanceId + ");\n");
  }
  this._instanceData.remove(specStrings.hosting.doubleKeys(workflowName, instanceId));
};
MemoryPersistence.prototype._loadState = function(workflowName, instanceId) {
  var state = this._instanceData.get(specStrings.hosting.doubleKeys(workflowName, instanceId));
  if (!state) {
    throw new Error("Instance data of workflow '" + workflowName + "' by id '" + instanceId + "' is not found.");
  }
  return state;
};
MemoryPersistence.prototype.loadPromotedProperties = function(workflowName, instanceId) {
  if (this._log) {
    console.log("loadPromotedProperties(" + workflowName + ", " + instanceId + ");\n");
  }
  var state = this._instanceData.get(specStrings.hosting.doubleKeys(workflowName, instanceId));
  return state ? state.promotedProperties : null;
};
module.exports = MemoryPersistence;
//# sourceMappingURL=data:application/json;base64,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O0FBQ1gsVUFBTSxJQUFJLEFBQUMsQ0FBQyx5QkFBd0IsRUFBSSxhQUFXLENBQUEsQ0FBSSxLQUFHLENBQUEsQ0FBSSxXQUFTLENBQUEsQ0FBSSxPQUFLLENBQUMsQ0FBQztFQUN0RjtBQUFBLEFBRUksSUFBQSxDQUFBLEtBQUksRUFBSSxDQUFBLElBQUcsY0FBYyxJQUFJLEFBQUMsQ0FBQyxXQUFVLFFBQVEsV0FBVyxBQUFDLENBQUMsWUFBVyxDQUFHLFdBQVMsQ0FBQyxDQUFDLENBQUM7QUFDNUYsT0FBTyxDQUFBLEtBQUksRUFBSSxDQUFBLEtBQUksbUJBQW1CLEVBQUksS0FBRyxDQUFDO0FBQ2xELENBQUM7QUFFRCxLQUFLLFFBQVEsRUFBSSxrQkFBZ0IsQ0FBQztBQUFBIiwiZmlsZSI6Imhvc3RpbmcvbWVtb3J5UGVyc2lzdGVuY2UuanMiLCJzb3VyY2VSb290IjoibGliL2VzNiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgU3RyTWFwID0gcmVxdWlyZShcImJhY2twYWNrLW5vZGVcIikuY29sbGVjdGlvbnMuU3RyTWFwO1xubGV0IEd1aWQgPSByZXF1aXJlKFwiZ3VpZFwiKTtcbnJlcXVpcmUoJ2RhdGUtdXRpbHMnKTtcbmxldCBzcGVjU3RyaW5ncyA9IHJlcXVpcmUoXCIuLi9jb21tb24vc3BlY1N0cmluZ3NcIik7XG5sZXQgSW5zdElkUGF0aHMgPSByZXF1aXJlKFwiLi9pbnN0SWRQYXRoc1wiKTtcbmxldCBpcyA9IHJlcXVpcmUoXCIuLi9jb21tb24vaXNcIik7XG5cbmZ1bmN0aW9uIE1lbW9yeVBlcnNpc3RlbmNlKGxvZykge1xuICAgIHRoaXMuX2luc3RhbmNlRGF0YSA9IG5ldyBTdHJNYXAoKTtcbiAgICB0aGlzLl9sb2Nrc0J5SWQgPSBuZXcgU3RyTWFwKCk7XG4gICAgdGhpcy5fbG9ja3NCeU5hbWUgPSBuZXcgU3RyTWFwKCk7XG4gICAgdGhpcy5fbG9nID0gbG9nID09PSB0cnVlO1xufVxuXG5NZW1vcnlQZXJzaXN0ZW5jZS5wcm90b3R5cGUuZW50ZXJMb2NrID0gZnVuY3Rpb24gKGxvY2tOYW1lLCBpbkxvY2tUaW1lb3V0TXMpIHtcbiAgICBpZiAodGhpcy5fbG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW50ZXJMb2NrKFwiICsgbG9ja05hbWUgKyBcIiwgXCIgKyBpbkxvY2tUaW1lb3V0TXMgKyBcIik7XFxuXCIpO1xuICAgIH1cblxuICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBjTG9jayA9IHRoaXMuX2xvY2tzQnlOYW1lLmdldChsb2NrTmFtZSk7XG4gICAgaWYgKGlzLnVuZGVmaW5lZChjTG9jaykgfHwgY0xvY2suaGVsZFRvLmNvbXBhcmVUbyhub3cpID09PSAtMSkge1xuICAgICAgICBsZXQgbG9ja0luZm8gPSB7XG4gICAgICAgICAgICBpZDogR3VpZC5jcmVhdGUoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgbmFtZTogbG9ja05hbWUsXG4gICAgICAgICAgICBoZWxkVG86IG5ldyBEYXRlKCkuYWRkTWlsbGlzZWNvbmRzKGluTG9ja1RpbWVvdXRNcylcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9sb2Nrc0J5SWQuc2V0KGxvY2tJbmZvLmlkLCBsb2NrSW5mbyk7XG4gICAgICAgIHRoaXMuX2xvY2tzQnlOYW1lLnNldChsb2NrSW5mby5uYW1lLCBsb2NrSW5mbyk7XG5cbiAgICAgICAgcmV0dXJuIGxvY2tJbmZvO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbk1lbW9yeVBlcnNpc3RlbmNlLnByb3RvdHlwZS5yZW5ld0xvY2sgPSBmdW5jdGlvbiAobG9ja0lkLCBpbkxvY2tUaW1lb3V0TXMpIHtcbiAgICBpZiAodGhpcy5fbG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVuZXdMb2NrKFwiICsgbG9ja0lkICsgXCIsIFwiICsgaW5Mb2NrVGltZW91dE1zICsgXCIpO1xcblwiKTtcbiAgICB9XG5cbiAgICBsZXQgY0xvY2sgPSB0aGlzLl9nZXRMb2NrQnlJZChsb2NrSWQpO1xuICAgIGNMb2NrLmhlbGRUbyA9IG5ldyBEYXRlKCkuYWRkTWlsbGlzZWNvbmRzKGluTG9ja1RpbWVvdXRNcyk7XG59O1xuXG5NZW1vcnlQZXJzaXN0ZW5jZS5wcm90b3R5cGUuZXhpdExvY2sgPSBmdW5jdGlvbiAobG9ja0lkKSB7XG4gICAgaWYgKHRoaXMuX2xvZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImV4aXRMb2NrKFwiICsgbG9ja0lkICsgXCIpO1xcblwiKTtcbiAgICB9XG5cbiAgICBsZXQgY0xvY2sgPSB0aGlzLl9nZXRMb2NrQnlJZChsb2NrSWQpO1xuICAgIHRoaXMuX2xvY2tzQnlOYW1lLnJlbW92ZShjTG9jay5uYW1lKTtcbiAgICB0aGlzLl9sb2Nrc0J5SWQucmVtb3ZlKGNMb2NrLmlkKTtcbn07XG5cbk1lbW9yeVBlcnNpc3RlbmNlLnByb3RvdHlwZS5fZ2V0TG9ja0J5SWQgPSBmdW5jdGlvbiAobG9ja0lkKSB7XG4gICAgbGV0IGNMb2NrID0gdGhpcy5fbG9ja3NCeUlkLmdldChsb2NrSWQpO1xuICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGlmICghY0xvY2sgfHwgbm93LmNvbXBhcmVUbyhjTG9jay5oZWxkVG8pID4gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb2NrIGJ5IGlkICdcIiArIGxvY2tJZCArIFwiJyBkb2Vzbid0IGV4aXN0cy5cIik7XG4gICAgfVxuICAgIHJldHVybiBjTG9jaztcbn07XG5cbk1lbW9yeVBlcnNpc3RlbmNlLnByb3RvdHlwZS5pc1J1bm5pbmcgPSBmdW5jdGlvbiAod29ya2Zsb3dOYW1lLCBpbnN0YW5jZUlkKSB7XG4gICAgaWYgKHRoaXMuX2xvZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImlzUnVubmluZyhcIiArIHdvcmtmbG93TmFtZSArIFwiLCBcIiArIGluc3RhbmNlSWQgKyBcIik7XFxuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZURhdGEuY29udGFpbnNLZXkoc3BlY1N0cmluZ3MuaG9zdGluZy5kb3VibGVLZXlzKHdvcmtmbG93TmFtZSwgaW5zdGFuY2VJZCkpO1xufTtcblxuTWVtb3J5UGVyc2lzdGVuY2UucHJvdG90eXBlLnBlcnNpc3RTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9sb2cpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwZXJzaXN0U3RhdGUoXCIgKyBzdGF0ZS53b3JrZmxvd05hbWUgKyBcIiwgXCIgKyBzdGF0ZS5pbnN0YW5jZUlkICsgXCIpO1xcblwiKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pbnN0YW5jZURhdGEuc2V0KHNwZWNTdHJpbmdzLmhvc3RpbmcuZG91YmxlS2V5cyhzdGF0ZS53b3JrZmxvd05hbWUsIHN0YXRlLmluc3RhbmNlSWQpLCBzdGF0ZSk7XG59O1xuXG5NZW1vcnlQZXJzaXN0ZW5jZS5wcm90b3R5cGUuZ2V0UnVubmluZ0luc3RhbmNlSWRIZWFkZXIgPSBmdW5jdGlvbiAod29ya2Zsb3dOYW1lLCBpbnN0YW5jZUlkKSB7XG4gICAgaWYgKHRoaXMuX2xvZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImdldFJ1bm5pbmdJbnN0YW5jZUlkSGVhZGVyKFwiICsgd29ya2Zsb3dOYW1lICsgXCIsIFwiICsgaW5zdGFuY2VJZCArIFwiKTtcXG5cIik7XG4gICAgfVxuXG4gICAgbGV0IHN0YXRlID0gdGhpcy5fbG9hZFN0YXRlKHdvcmtmbG93TmFtZSwgaW5zdGFuY2VJZCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdXBkYXRlZE9uOiBzdGF0ZS51cGRhdGVkT24sXG4gICAgICAgIHdvcmtmbG93VmVyc2lvbjogc3RhdGUud29ya2Zsb3dWZXJzaW9uXG4gICAgfTtcbn07XG5cbk1lbW9yeVBlcnNpc3RlbmNlLnByb3RvdHlwZS5sb2FkU3RhdGUgPSBmdW5jdGlvbiAod29ya2Zsb3dOYW1lLCBpbnN0YW5jZUlkKSB7XG4gICAgaWYgKHRoaXMuX2xvZykge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvYWRTdGF0ZShcIiArIHdvcmtmbG93TmFtZSArIFwiLCBcIiArIGluc3RhbmNlSWQgKyBcIik7XFxuXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9sb2FkU3RhdGUod29ya2Zsb3dOYW1lLCBpbnN0YW5jZUlkKTtcbn07XG5cbk1lbW9yeVBlcnNpc3RlbmNlLnByb3RvdHlwZS5yZW1vdmVTdGF0ZSA9IGZ1bmN0aW9uICh3b3JrZmxvd05hbWUsIGluc3RhbmNlSWQpIHtcbiAgICBpZiAodGhpcy5fbG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlU3RhdGUoXCIgKyB3b3JrZmxvd05hbWUgKyBcIiwgXCIgKyBpbnN0YW5jZUlkICsgXCIpO1xcblwiKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pbnN0YW5jZURhdGEucmVtb3ZlKHNwZWNTdHJpbmdzLmhvc3RpbmcuZG91YmxlS2V5cyh3b3JrZmxvd05hbWUsIGluc3RhbmNlSWQpKTtcbn07XG5cbk1lbW9yeVBlcnNpc3RlbmNlLnByb3RvdHlwZS5fbG9hZFN0YXRlID0gZnVuY3Rpb24gKHdvcmtmbG93TmFtZSwgaW5zdGFuY2VJZCkge1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuX2luc3RhbmNlRGF0YS5nZXQoc3BlY1N0cmluZ3MuaG9zdGluZy5kb3VibGVLZXlzKHdvcmtmbG93TmFtZSwgaW5zdGFuY2VJZCkpO1xuICAgIGlmICghc3RhdGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5zdGFuY2UgZGF0YSBvZiB3b3JrZmxvdyAnXCIgKyB3b3JrZmxvd05hbWUgKyBcIicgYnkgaWQgJ1wiICsgaW5zdGFuY2VJZCArIFwiJyBpcyBub3QgZm91bmQuXCIpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG59O1xuXG5NZW1vcnlQZXJzaXN0ZW5jZS5wcm90b3R5cGUubG9hZFByb21vdGVkUHJvcGVydGllcyA9IGZ1bmN0aW9uICh3b3JrZmxvd05hbWUsIGluc3RhbmNlSWQpIHtcbiAgICBpZiAodGhpcy5fbG9nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwibG9hZFByb21vdGVkUHJvcGVydGllcyhcIiArIHdvcmtmbG93TmFtZSArIFwiLCBcIiArIGluc3RhbmNlSWQgKyBcIik7XFxuXCIpO1xuICAgIH1cblxuICAgIGxldCBzdGF0ZSA9IHRoaXMuX2luc3RhbmNlRGF0YS5nZXQoc3BlY1N0cmluZ3MuaG9zdGluZy5kb3VibGVLZXlzKHdvcmtmbG93TmFtZSwgaW5zdGFuY2VJZCkpO1xuICAgIHJldHVybiBzdGF0ZSA/IHN0YXRlLnByb21vdGVkUHJvcGVydGllcyA6IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeVBlcnNpc3RlbmNlOyJdfQ==