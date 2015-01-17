appControllers.controller('CalorieListCtrl', ['$scope', '$http', '$q', 'ConfigService',
	function CalorieListCtrl($scope, $http, $q, config) {
		$scope.calories = [];
		$scope.user = config.user();
		$scope.newCalorie = {};
		$scope.criteria = {}; // {date_from: '02/12/2014', date_to: '02/12/2014', time_from: '05:00:00 AM', time_to: '01:00:00 PM'};
		$('.bootstrap-datetimepicker').datetimepicker(config.datePickerOption);
		$('.bootstrap-timepicker').datetimepicker(config.timePickerOption);
		var onInvalidDateTime = function(e) {
		  if (e && e.currentTarget) e.currentTarget.value = '';
		}
    $('.bootstrap-datetimepicker').on("dp.error", onInvalidDateTime);
    $('.bootstrap-timepicker').on("dp.error", onInvalidDateTime);
		// $('#datetimepicker1').datetimepicker();
    /*
    console.log(moment('22/12/2014', 'DD/MM/YYYY').isValid());
    console.log(moment('22/12/2014', 'MM/DD/YYYY').isValid());
    console.log(moment('23:59:59', 'hh:mm:ss').isValid());
    console.log(moment('23:59:60', 'hh:mm:ss').isValid());
    */
    var extend = function(calorie) {
      if (calorie === undefined || calorie == null || calorie.date === undefined || calorie.date == null) return;
      if (!calorie.hasOwnProperty('_timestamp') || calorie._timestamp === undefined || calorie._timestamp == null) {
        var mm = moment(calorie.date, moment.ISO_8601);
        calorie._moment = mm;
        calorie._timestamp = mm.unix(); // calorie.time
        calorie.date = mm.format(config.dateFormat);
        calorie.time = mm.format(config.timeFormat);
        calorie.datetime = mm.format(config.dateTimeFormat);
        calorie.datetimeFormat = config.dateTimeFormat;
      }
    };
    var filter = function(calorie) {
      var c = $scope.criteria;
      var ss = 86400; // 24 * 60 *60
      var td = 39600; // 11 * 60 *60, time difference
      var tf = 0, tt = ss, mf, mt;
      if (c.hasOwnProperty('time_from') && c.time_from != '') {
        mf = moment(c.time_from, config.timeFormat);
        tf = (mf.unix()+td) % ss;
      }
      if (c.hasOwnProperty('time_to') && c.time_to != '') {
        mt = moment(c.time_to, config.timeFormat);
        tt = (mt.unix()+td) % ss;
      }
      var tc = (calorie._timestamp+td) % ss;
      if (tc >= tf && tc <= tt) calorie.visible = '';
      else calorie.visible = 'hide';
      // console.log(tc, tf, tt, calorie.amount);
    };
    var level = function(keys, l) {
      var i, key;
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        $scope.calories[key].level = l;
      }
    };
    var refresh = function(filtered) {
      var map = {};
      var mk, mv;
      if (filtered === undefined) filtered = true;
      for (var key in $scope.calories) {
        // $scope.calories[key].date = new Date($scope.calories[key].date).toString(config.dateFormat);
        extend($scope.calories[key]);
        if (filtered) filter($scope.calories[key]);
        $scope.calories[key].level = 'unknown';
        mk = $scope.calories[key].date;
        if (!map[mk]) map[mk] = {total: 0, keys: []};
        map[mk].total += $scope.calories[key].amount;
        map[mk].keys.push(Number(key));
      }
      for (var d in map) {
        mv = map[d];
        if (mv.total < $scope.user.setting.expNumber) level(mv.keys, 'normal');
        else level(mv.keys, 'high');
      }
    };

    $scope.listCalories = function() {
      $http.get(config.baseUrl + 'calories', {withCredentials: true}).success(function(data, status) {
        $scope.calories = data;
        refresh(false);
      }).error(function(error, status) {
        config.error(error);
      });
    };

    $scope.searchCalories = function(criteria) {
      var c = $.extend(criteria, {
        date_from : $('#date_from').val(),
        date_to   : $('#date_to').val(),
        time_from : $('#time_from').val(),
        time_to   : $('#time_to').val()
      });

      // Search calorie
      $http.post(config.baseUrl + 'calories-search', c, {withCredentials: true}).success(function(results) {
        $scope.calories = results;
        refresh();
      }).error(function(error, status) {
        config.error(error);
      });
    };

    $scope.findCalorie = function(calorie) {
      var calories = $scope.calories;
      for (var i in calories) {
        if (calories[i]._id == calorie._id) {
          return calories[i];
        }
      }
      return false;
    };

    $scope.addCalorie = function() {
      $scope.newCalorie = {};
      /*
      var html = '<form id="addCalorie" class="noframe">'
        + '<h2 class="title">Add a new meal</h2>'
        + '<div class="input-group">'
        + '<input type="text" id="effective_date" class="form-control bootstrap-datetimepicker" placeholder="Date" ng-model="newCalorie.date" required />'
        + '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'
        + '</div>'
        + '<div class="input-group">'
        + '<input type="text" id="effective_time" class="form-control bootstrap-timepicker" placeholder="Time" ng-model="newCalorie.time" required />'
        + '<span class="input-group-addon"><i class="fa fa-clock-o"></i></span>'
        + '</div>'
        + '<div class="input-group">'
        + '<input type="text" class="form-control" placeholder="Description" ng-model="newCalorie.description" required />'
        + '</div>'
        + '<div class="input-group">'
        + '<input type="number" class="form-control" placeholder="Calories" ng-model="newCalorie.amount" required />'
        + '</div>'
        + '<a class="btn btn-primary hide" id="btnSaveCalorie" ng-click="saveCalorie(calorie)">Save</a>'
        + '</form>';
      */
      var box = bootbox.dialog({
        // TODO: ng-model is not binded to this dynamic form
        message : $('#addCalorieDiv').html(),
        className : 'small-dialog',
        buttons : {
          ok : {
            className: 'btn btn-primary pull-left',
            label : 'Save',
            callback : function(event) {
              return $scope.saveCalorie(event);
            }
          },
          cancel : {
            className: 'btn btn-primary pull-left',
            label : 'Cancel'
          }
        },
        size : 'small'
      });
      $('.bootstrap-datetimepicker').datetimepicker(config.datePickerOption);
      $('.bootstrap-timepicker').datetimepicker(config.timePickerOption);
      // $('.bootstrap-datetimepicker').on("dp.error", onInvalidDateTime);
      // $('.bootstrap-timepicker').on("dp.error", onInvalidDateTime);
    };
    
    $scope.saveCalorie = function(e) {
      var ne = $.extend({
        date : $('.bootbox-body #addCalorie #effective_date').val(),
        time : $('.bootbox-body #addCalorie #effective_time').val(),
        description : $('.bootbox-body #addCalorie #description').val(),
        amount : $('.bootbox-body #addCalorie #amount').val()
      }, $scope.newCalorie);
      console.log('saveCalorie', ne);
      var error = $.validator.checkCalorie(ne);
      if (error) {
        config.error(error);
        return false;
      }
      ne.datetime = ne.date + ' ' + ne.time;
      ne.datetimeFormat = config.dateTimeFormat;

      // Save calorie
      $http.post(config.baseUrl + 'calories', ne, {withCredentials: true}).success(function(result) {
        $scope.calories.push(result);
        refresh();
      }).error(function(error, status) {
        config.error(error);
      });
    };

    $scope.editCalorie = function(calorie) {
      var target = $scope.findCalorie(calorie);
      if (target) {
        target.editable = true;
        $('#ne_' + target._id + '_date').datetimepicker(config.datePickerOption);
        $('#ne_' + target._id + '_time').datetimepicker(config.timePickerOption);
      }
    };

    $scope.updateCalorie = function(newCalorie, calorie) {
      // TODO: newCalorie is undefined, ng defer??
      var target = $scope.findCalorie(calorie);
      if (!target) {
        config.error('Data not found!');
        return;
      }
      var ne = {
        _id: target._id,
        date: $('#ne_' + target._id + '_date').val(),
        time: $('#ne_' + target._id + '_time').val(),
        amount: $('#ne_' + target._id + '_amount').val(),
        description: $('#ne_' + target._id + '_description').val(),
      };
      ne.datetime = ne.date + ' ' + ne.time;
      ne.datetimeFormat = config.dateTimeFormat;
      $http.put(config.baseUrl + 'calories/' + calorie._id, ne, {withCredentials: true}).success(function(result) {
        calorie = $.extend(calorie, result);
        calorie._timestamp = null;
        calorie.editable = false;
        refresh();
      }).error(function(error, status) {
        config.error(error);
      });
    };

    $scope.cancelUpdate = function(newCalorie, calorie) {
      calorie.editable = false;
    };

    $scope.deleteCalorie = function(calorie) {
      $http.delete(config.baseUrl + 'calories/' + calorie._id, {withCredentials: true}).success(function(data) {
        var calories = $scope.calories;
        for (var item in calories) {
          if (calories[item]._id == data._id) {
            $scope.calories.splice(item, 1);
            refresh();
            return ;
          }
        }
      }).error(function(error, status) {
        config.error(error);
      });
    };

    $scope.listCalories();

	}]);


	