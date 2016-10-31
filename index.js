new Vue({
  el: '#app',
  data: {
      'currentWth': { // 当前天气状况
        'temperature': '--'
      }, 
      'forecastWth': '', // 天气预测状况
      'forecastWeek': [],
      'cityAddress':''
  },
  ready: function () {
    // console.log(BMap);
    this.getLocation();
  },
  methods: {
    //获取经纬度
    getLocation: function(){
      if(navigator.geolocation) {
          var Options = { // 配置参数解释 官方文档链接 todo
              enableHighAccuracy: true,
              timeout:5000,
              maximumAge:0
          };
          // 获取位置信息
          navigator.geolocation.getCurrentPosition(this.handdleSuccess, this.handdleError, Options);
          // 监视实时位置变化
          var watcher_id = navigator.geolocation.watchPosition(this.handdleSuccess, this.handdleError, Options);
          navigator.geolocation.clearWatch(watcher_id);
      }
    },
    
      handdleSuccess: function (position) {
          // 打印位置信息
          console.log(position.coords.longitude,position.coords.latitude);
          this.getCurrentwth(position.coords.longitude,position.coords.latitude);
          this.getForecastrwth(position.coords.longitude,position.coords.latitude);
          this.getMyaddress(position.coords.longitude,position.coords.latitude);
      },
      handdleError: function (error) {
          switch(error.code) {
              case error.TIMEOUT: console.log('超时');
              break;
              case error.PERMISSION_DENIED: console.log('用户拒绝提供地理位置');
              break;
              case error.POSITION_UNAVAILABLE: console.log('地理位置不可用');
              break;
              default: break;
          }
      },
    //获取城市
    getMyaddress:function(lng,lat){
      let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng;
      this.$http.get(url).then(res => {
        console.log(res.body.results[0].address_components[5].long_name);
        let city = res.body.results[0].address_components[5];
        this.$set('cityAddress',city);
      }).catch(err => {
        console.log(err);
      });

    },
    // getLocation: function(){
    //   let _this = this;
    //   let geolocation = new BMap.Geolocation();
    //   geolocation.getCurrentPosition(function(r){
    //     if(this.getStatus() == 0){
    //       console.log('您的位置：'+r.point.lng+','+r.point.lat);
    //       _this.getMyaddress(r.point.lng,r.point.lat)
    //       _this.getCurrentwth(r.point.lng,r.point.lat);
    //       _this.getForecastrwth(r.point.lng,r.point.lat);
    //     }
    //     else {
    //       alert('failed'+this.getStatus());
    //     }        
    //   },{enableHighAccuracy: true})
    // },

    // //获取城市名
    // getMyaddress: function(lng,lat){
    //   let point = new BMap.Point(lng,lat);
    //   let geoc = new BMap.Geocoder();
    //   geoc.getLocation(point,function(rs){
    //     let addComp = rs.addressComponents;
    //     document.getElementById('address').innerHTML = addComp.city;
    //   });
    // },

    //当天天气状况
    getCurrentwth: function (lng,lat){
        this.$http.jsonp('https://api.caiyunapp.com/v2/DxGJIQ==5n8qq9Np/'+lng+','+lat+'/realtime.jsonp').then((response) => {
            let data = response.body.result;
            data.temperature = parseInt(data.temperature);
            this.$set('currentWth',data);
        });
    },

    //天气预测借口
    getForecastrwth: function (lng,lat){
      this.$http.jsonp('https://api.caiyunapp.com/v2/DxGJIQ==5n8qq9Np/'+lng+','+lat+'/forecast.jsonp').then((response) => {
          let data = response.body.result.hourly;
          this.$set('forecastWth',data);
          let foreaTemdata = response.body.result.daily.temperature;
          let foreaSkydata = response.body.result.daily.skycon;
          let arr = [];

          for (let i = 0; i < foreaSkydata.length; i++) {
            arr.push([foreaSkydata[i].value]);
          };
          for (let i = 0; i < foreaTemdata.length; i++) {
            arr[i].push(foreaTemdata[i].date);
            arr[i].push(parseInt(foreaTemdata[i].max));
            arr[i].push(parseInt(foreaTemdata[i].min));
          };
          this.$set('forecastWeek',arr);
      });
    },
    //判断Skycons取值
    skyVal: function(e){
      let x,y;
      switch(e){
        case 'CLEAR_DAY':
          x = '晴天';
          y = 'icon-weather';
          break;
        case 'CLEAR_NIGHT':
          x = '晴夜';
          y = 'icon-weathernight';
          break;
        case 'PARTLY_CLOUDY_DAY':
          x = '多云';
          y = 'icon-weathercloudy';
          break;
        case 'PARTLY_CLOUDY_NIGHT':
          x = '多云';
          y = 'icon-weathercloudy';
          break;
        case 'CLOUDY':
          x = '阴';
          y = 'icon-yin';
          break;
        case 'RAIN':
          x = '雨';
          y = 'icon-weatherrainy';
          break;
        case 'SLEET':
          x = '冻雨';
          y = 'icon-tianqizitiku33';
          break;
        case 'SNOW':
          x = '雪';
          y = 'icon-weathersnow';
          break;
        case 'WIND':
          x = '风';
          y = 'icon-weatherwindy';
          break;
        case 'FOG':
          x = '雾';
          y = 'icon-weatherfog';
          break;
        case 'HAZE':
          x = '霾';
          y = 'icon-maihaze';
          break;
      }
      return [x,y];
    },

    //判断week
    getWeek: function(e){
      let ary1 = new Array();
          ary1 = e.split('-');
      let ssdate = new Date(ary1[0],parseInt(ary1[1]-1),ary1[2]);
      let week = new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
      let new_week = ssdate.getDay();
      let str = week[new_week];
      return str;
    },
  }
})
