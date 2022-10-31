/* global mGH */

$(window).unload(function () {})
//定義:將Ajax方法包成一個method
//注意:為減輕request數 callRESTAPI分別宣告於: m_common.js, step2.js 因此有修改要同步修改
function callRESTAPI(obj) {
  var method = obj.method,
    headers = obj.headers,
    path = obj.path,
    data = obj.data,
    callback = obj.callback,
    errcallback = obj.errcallback

  if (headers == null) {
    headers = {}
  }

  if (data == null) {
    data = null
  }

  if ($.inArray(method, ['PUT', 'GET', 'POST', 'DELETE']) == -1) {
    console.log('The HTTP verbs error!')
    return
  }

  var _callback = null

  if (typeof parameters == 'function') {
    _callback = parameters
    if (typeof callback == 'string') {
      _callback = callback
    }
  }

  if (typeof callback == 'function') {
    _callback = callback
  }

  //區分是否為本機端
  var domain = location.hostname
  domain = domain.substr(0, domain.indexOf('.'))
  var _deferred,
    error = function (jqXHR, textStatus) {
      if (typeof errcallback === 'function') {
        errcallback()
      }
    }
  if (domain == 'localhost') {
    _deferred = $.ajax({
      url: path,
      headers: headers,
      contentType: 'application/json; charset=utf-8',
      data: data,
      type: method,
      dataType: 'json',
      async: true,
      cache: false,
      success: function () {},
      error: function (jqXHR, textStatus, errorThrown) {
        error(jqXHR, textStatus, errorThrown)
      },
    })
  } else {
    _deferred = $.ajax({
      url: path,
      headers: headers,
      contentType: 'application/json; charset=utf-8',
      data: data,
      type: method,
      dataType: 'json',
      async: true,
      cache: false,
      success: function () {},
      error: function (jqXHR, textStatus, errorThrown) {
        error(jqXHR, textStatus, errorThrown)
      },
    })
  }

  if (typeof _callback === 'function') {
    _deferred.done(_callback)
  }

  return _deferred.promise()
}

//mGH全域物件
;(function (_global) {
  var global
  if (window[_global] == null) {
    global = {}
  } else {
    global = window[_global]
  }

  /*注意:物件建立改由mGlobal.jsp建立
  var global = window[_global] = {};
  global.apiHttp = ""; //local要用 http:
  global.apiDomain = "//muat.shopping.friday.tw";
  global.apiFolder = "/smartphone";
  global.apiView = "/m";
  global.apiService = "/mobileapi/";
  global.webService = "/mobileweb/";
  */
  /*公用版:確認ajax傳回的結果*/
  global.AjaxCheck_fn = function (json) {
    var checked
    if (json.response.status !== 'OK' || json.response.message !== 'Success') {
      //console.log(json.response.status)
      //console.log(json.response.message)
      //console.log("ajax response回傳有問題請檢查")
      checked = false
    } else {
      checked = true
    }
    return checked
  }
})('mGH')

//定義:change縣市
function chgAddressCity(cityElementId, countryElementId, _callback) {
  var cityId = $('#' + cityElementId + '').val()
  if (cityId) {
    getCountryOptions(countryElementId, cityId)
  } else {
    $('#' + countryElementId + ' option').remove()
  }

  if (typeof _callback === 'function') {
    _callback()
  }
}

//定義:組出區域下拉選單option方法
function getCountryOptions(countryElementId, cityId, selVal) {
  cityId = $.trim(cityId)
  selVal = $.trim(selVal)
  var result = addreddJSON.data
  result = result[0].address
  var size = result.length
  var selCountry = ''
  for (var i = 0; i < size; i++) {
    if (result[i].id === cityId * 1) {
      selCountry = result[i]
      break
    }
  }

  if (selCountry) {
    var countryOptios = selCountry.counties
    size = countryOptios.length
    $('#' + countryElementId + ' option').remove()
    for (var i = 0; i < size; i++) {
      var opt = countryOptios[i]
      if (opt.id === selVal * 1) {
        $('#' + countryElementId + '').append(
          $('<option></option>')
            .attr('value', opt.id + ',' + opt.zip)
            .attr('selected', true)
            .text(opt.name)
        )
      } else {
        $('#' + countryElementId + '').append(
          $('<option></option>')
            .attr('value', opt.id + ',' + opt.zip)
            .text(opt.name)
        )
      }
    }
  }
}

//地址轉座標方法
function getLatLngByAddr() {
  //console.log(mGH.svcAddress)
  var geocoder = new google.maps.Geocoder() //定義一個Geocoder物件
  geocoder.geocode(
    {
      address: mGH.svcAddress,
    }, //設定地址的字串
    function (results, status) {
      //callback function
      //判斷狀態
      if (status == google.maps.GeocoderStatus.OK) {
        //console.log(results[0].geometry.location)  //取得座標
        mGH.Y = results[0].geometry.location.lat() //緯度
        mGH.X = results[0].geometry.location.lng() //經度
        initMap()
      } else {
        //alert('Error:座標擷取錯誤!')
        $('#map_canvas')
          .addClass('error')
          .html('座標擷取錯誤!<br/>您仍可使用"確認門市"功能')
      }
    }
  )
}

//繪製google map方法
function initMap() {
  var map
  //地圖
  var mapOptions = {
    zoom: 17, //設定地圖距離
    center: new google.maps.LatLng(mGH.Y, mGH.X), //預設地圖中心點
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }
  map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions)
  //座標點
  var markerOptions = {
    position: new google.maps.LatLng(mGH.Y, mGH.X),
    map: map,
  }
  var marker = new google.maps.Marker(markerOptions)
}

//定義:讀取遠傳幣
//function FCoin_fn() {
//  $(".offsetCtrl_FCoin").hide()
//  callRESTAPI({
//    method: 'GET',
//    path: mGH.apiHttp + mGH.apiDomain + mGH.apiView + mGH.apiService + "fcoin/queryFcoins",
//    callback: function(msg) {
//      if (msg.code != '0000' || msg.message != 'OK') {
//        return false;
//      }
//      var p = msg.payload[0].amount;
//      mGH.FCoin = p;
//      if (p == 0 || p == null) {
//        $(".offsetCtrl_FCoin").hide()
//      } else {
//        $(".offsetCtrl_FCoin").show()
//      }
//      $(".offsetCtrl_FCoin .note").html('你尚有點數<span>' + p + '</span>點，可折抵消費<span>$<span id="maxFCoin">' + p + '</span></span>元')
//    }
//  })
//}

//定義:讀取HG點數
//function happyGoPoint_fn(_callback) {
//  //判斷是否有撈取過
//  var tmpAmount = parseInt($("#settleAccounts")
//    .val())
//  if (mGH.userHGPrice != null && (orderAmount - parseInt(orderDiscount)) == tmpAmount) {
//    _callback()
//    return false;
//  }
//
//  callRESTAPI({
//    method: 'GET',
//    path: mGH.apiHttp + mGH.apiDomain + mGH.apiView + mGH.apiService + "happyGoPoint",
//    callback: function(msg) {
//      //console.log(msg)
//      if (!mGH.AjaxCheck_fn(msg)) {
//        return false;
//      }
//      var ratioP = parseInt($(".offsetCtrl_happyGoPoint .note span:first")
//          .text(), 10),
//        ratioM = parseInt($(".offsetCtrl_happyGoPoint .note span:last")
//          .text(), 10)
//      mGH.userHGPoint = msg.payload.result;
//      mGH.userHGPrice = Math.floor(mGH.userHGPoint / ratioP) * ratioM;
//      try {
//        var tmpPay = $("#settleAccounts")
//          .val()
//
//        //要依照折扣後比例
//        if (hgMaxRate != null) {
//          discountLimit = Math.floor((tmpPay * hgMaxRate) / 100)
//        }
//        //可折抵金額
//        if (discountLimit != null && discountLimit != "" && mGH.userHGPrice > discountLimit) {
//          var limit = parseInt(discountLimit)
//          mGH.userHGPrice = Math.floor(limit / ratioM) * ratioM;
//        }
//        //不能超過商品價格
//        if (mGH.userHGPrice > tmpPay) {
//          mGH.userHGPrice = Math.floor(tmpPay / ratioM) * ratioM;
//        }
//
//      } catch (err) {
//
//      }
//      _callback()
//    }
//  })
//}

//定義:從新計算折抵總金額方法
function calcSum() {
  var chechVal = function (_val) {
    if (isNaN(_val) || _val == 'NaN' || _val == null || _val == 'undefined') {
      _val = 0
    }
    return _val
  }
  var calcTotal = parseInt($('#calcTotal').attr('calc'), 10)
  calcTotal = chechVal(calcTotal)

  var calcCoupon = parseInt($('#calcCoupon').attr('calc'), 10)
  calcCoupon = chechVal(calcCoupon)

  var calcDiscountCode = parseInt($('#calcDiscountCode').attr('calc'), 10)
  calcDiscountCode = chechVal(calcDiscountCode)

  var calcWelfarePoint = parseInt($('#calcWelfarePoint').attr('calc'), 10)
  calcWelfarePoint = chechVal(calcWelfarePoint)

  var calcFCoin = parseInt($('#calcFCoin').attr('calc'), 10)
  calcFCoin = chechVal(calcFCoin)

  if (orderLifeCoinAmount != '') {
    calcFCoin = calcFCoin - parseInt(orderLifeCoinAmount)
  }

  var calcHGPoint = parseInt($('#calcHGPoint').attr('calc'), 10)
  calcHGPoint = chechVal(calcHGPoint)

  var calcTPDiscount = parseInt($('#calcTPDiscount').attr('calc'), 10)
  calcTPDiscount = chechVal(calcTPDiscount)

  var calcShippingFee = parseInt($('#calcShippingFee').attr('calc'), 10)
  calcShippingFee = chechVal(calcShippingFee)

  var calcEvent = parseInt($('#calcEvent').attr('calc'), 10)
  calcEvent = chechVal(calcEvent)

  var settle =
    calcTotal -
    (calcTPDiscount +
      calcCoupon +
      calcWelfarePoint +
      calcFCoin +
      calcHGPoint +
      calcDiscountCode) +
    calcShippingFee -
    calcEvent

  var payType = $('#payTypeName').val() //判斷如果不是ATM轉帳才要改變ui用

  //	if( settle < 0 || settle == 0){
  //		settle = 0;
  //		if(payType != "PAYTYPE_MATM_1"){
  //			//$(".pay_area").parent(".oneArea").hide()
  //			$(".pay_area p, .FastCtrl_area, .lookbank").hide()
  //			$(".payBtnStyle").hide()
  //			$("#storeBtn").show()
  //			$(".card_area").hide()
  //		}
  //	} else {
  //		if(payType != "PAYTYPE_MATM_1"){
  //			//$(".pay_area").parent(".oneArea").show()
  //			$(".pay_area p, .FastCtrl_area, .lookbank").show()
  //			$(".payBtnStyle").show()
  //			$(".card_area").show()
  //		}
  //	}

  $('#settleAccounts').val(settle)
  //計算0利率金額---start
  var periods = [3, 6, 12, 18, 24, 30, 36]
  for (var i = 0; i < periods.length; i++) {
    var period = periods[i]
    if (
      $('.PAYTYPE_CARD_' + period).length > 0 ||
      $('.PAYTYPE_CARDPE_' + period).length > 0
    ) {
      var result = settle / period
      result = Math.floor(result)
      $('.PAYTYPE_CARD_' + period + ' .count').text(result)
      $('.PAYTYPE_CARDPE_' + period + ' .count').text(result)
    }
  }
  //計算0利率金額---end
  //高分期 -- start
  for (var i = 0; i < periods.length; i++) {
    var period = periods[i]
    if ($('.PAYTYPE_CARDI_' + period).length > 0) {
      var interestRate = $(
        "input[name='interestRatePAYTYPE_CARDI_" + period + "']"
      ).val()
      var result = Math.ceil(settle * (interestRate / 100 + 1)) / period
      result = Math.floor(result)
      $('.PAYTYPE_CARDI_' + period + ' .count').text(result)
    }
  }
  //高分期 -- end
  if (settle < 0) {
    settle = 0
  }
  $('.settle_accounts_area .td').html(settle)

  //若金額為零則使用全額折抵區塊
  if (settle == 0 || settle < 0) {
    $('#pay_type_pay_done_0').show()
    $('#pay_type_pay_done_0 .paytype').addClass('active')
    $('.card_area').hide()
    $('#pay_types').hide()
    var ShippingType = $('input[name=cartTypeId]').val()
    if (ShippingType == '4') {
      //金石堂才需要先選擇超商店家
      $('.oneArea.store_area').show()
    }
    $("input[id='fullAmount_offset2']").prop('checked', true)
    $("input[id='payTypeName']").val('PAYTYPE_DONE_0')
  } else {
    $('#pay_type_pay_done_0').hide()
    $('#pay_types').show()
    $("input[id='fullAmount_offset2']").prop('checked', false)
    var payTypeChecked = $("input[name='paytype']:checked")
      .parent()
      .attr('class')
    var cartTypeId = $("input[name='cartTypeId']").val()
    if (payTypeChecked != undefined || payTypeChecked != null) {
      $("input[id='payTypeName']").val(payTypeChecked.split(' ')[0])
    } else {
      //沒有選擇結帳方式時的默認設定
      if (cartTypeId == 2 || cartTypeId == 4) {
        //超商取貨&金石堂，預設使用PAYTYPE_STOR_1，遠傳門市取貨預設信用卡一次付
        if (
          orderDelivery.indexOf('FET') >= 0 ||
          orderDelivery.indexOf('DE') >= 0
        ) {
//          $("input[id='payTypeName']").val('PAYTYPE_CARD_1')
        } else {
          $("input[id='payTypeName']").val('PAYTYPE_STOR_1')
        }
      } else {
        //宅配&快速到貨，預設使用信用卡一次付清
//        $("input[id='payTypeName']").val('PAYTYPE_CARD_1')
//        $('.card_area').show()
      }
    }
  }
  return (
    calcTotal -
    (calcTPDiscount + calcCoupon + calcWelfarePoint + calcFCoin + calcHGPoint) +
    calcShippingFee
  )
}
var f ;
$(function () {
  //初始化app轉轉收件人資料(for app轉轉)
  const st = sessionStorage.getItem('turnturn_AI');
  if(st === 'app'){
    f = callFlutter();
    appConsigneeInit();
  }
  
  // 發票information =============================================================

  $("input[type='date']").change(function () {
    $("input[type='date']").val() != ''
      ? $(this).next('span').hide()
      : $(this).next('span').show()
  })

  //若有session暫存，先清除
  $.removeCookie('JSESSIONID-test', { path: '/mobileweb' })

  var jes = GetUTF8Cookie('JSESSIONID')

  //將目前的 JSESSIONID 進行暫存，避免在選超商門市時，發生session 遺失後續在submit時將其補回，若失效可先檢查否為httpOnly造成
  $.cookie('JSESSIONID-test', jes, { path: '/mobileweb' })

  try {
    mGH.shoppingBagSummyList_fn() //step2即時更新cookie
  } catch (e) {
    console.log('mGH.shoppingBagSummyList_fn ERROR!!!')
    console.log(e)
  }

  var resize_fn = function () {
    var windowW = $(document).width() //瀏覽器寬度

    // 結帳方式的按鈕
    var payBtnW = windowW / 2 - 27
    $('.payBtnStyle').width(payBtnW)

    // 結帳方式的按鈕-調整高度造成的偏差
    var payBtnH = 0
    if ($('.payBtnStyle').size() > 0) {
      payBtnH = $('.payBtnStyle').height()
    }
    if (payBtnH > 0) {
      $('.payBtnStyle').height(payBtnH)
    }
  }

  //無信用卡付款選項時，移除快速結帳區塊，預設付款方式改成ATM付款
  if ($('.PAYTYPE_CARD_1.paytype').size() < 1) {
    if (cartTypeId == 2) {
      $("input[id='payTypeName']").val('PAYTYPE_STOR_1')
    } else {
      $('.oneArea.card_area').remove()
      $("input[name='payTypeName']").val('PAYTYPE_MATM_1')
    }
  }

  //全額折抵時，隱藏信用卡分期提示(信用卡分期金額除不盡餘數於第一期收取)
  var finalPrice = calcSum()
  if (finalPrice == 0) {
    $('.usebox .note').hide()
    $("input[id='fullAmount_offset']").prop('checked', true)
    $("input[id='payTypeName']").val('PAYTYPE_DONE_0')
  }

  setTimeout(resize_fn, 300)
  $(window).resize(resize_fn)

  if (!isfirstOrderpeople) {
    //welfarePoint_fn() //撈取福利點點數
    //FCoin_fn() //撈取遠傳幣數量
  }
  calcSum()

  $('#agreementCheckbox').prop('checked', true)
  $('#agreementMemCheckbox').prop('checked', true)
  $('#agreementFastCheckbox').prop('checked', true)

  //信用卡:使用輸入套件
  $('.cardGroupNum').mask('9999-9999-9999-9999', {
    placeholder: '____-____-____-____',
  })

  //定義:清空首購輸入表單方法
  function firstOrderpeopleResetUI_fn() {
    var firstDOM = $('.firstOrderpeople_area')
    firstDOM.find('select').find('option:first').prop('selected', 'selected') //所有下拉選單
    firstDOM
      .find('select')
      .find('#keepOptionSelected')
      .prop('selected', 'selected') //所有下拉選單

    if (userEmail != '') {
      $('.firstEmail').val(userEmail)
    }

    // 名字有資料就鎖住
    if (firstDOM.find('.firstName').val() && !isfirstOrderpeople) {
      $('.firstOrderpeople_area').find('.firstName').attr('disabled', true)
    }

    // 生日有資料就鎖住
    if (memberBirthday != '' && memberBirthday != null && !isfirstOrderpeople) {
      var birthday = memberBirthday.split(' ')[0]
      $('#memberBirthday').val(birthday)
    }

    // 性別有資料就鎖住
    if (
      memberGender != '' &&
      memberGender != null &&
      memberGender != '2' &&
      !isfirstOrderpeople
    ) {
      if (memberGender == '1') {
        $('.firstOrderpeople_area').find('select[name=firstSex]').val('male')
      } else if (memberGender == '0') {
        $('.firstOrderpeople_area').find('select[name=firstSex]').val('female')
      }
    }

    // 性別與生日有值就把區塊隱藏
    if (
      memberGender != '' &&
      memberGender != null &&
      memberBirthday != '' &&
      memberBirthday != null &&
      !isfirstOrderpeople &&
      memberGender != '2'
    ) {
      $('.sexAndBirthdayArea').hide()
    }
  }
  //首購情況下才執行, 或是資料不完整會員, andOpenId會員
  if (isfirstOrderpeople || $('.firstOrderpeople_area').size() > 0) {
    // 清空首購輸入表單
    firstOrderpeopleResetUI_fn()

    var firstDOM = $('.firstOrderpeople_area')

    //首購我同意friDay購物網站會員的約定條款
    $('.firstMemAddCtrl_area').show()

    //移除折抵區塊(HG point, coupon),訪客購物可以使用折扣碼故不移除
    if ($("input[name='activatedStatus']").val() == 4) {
      //如果有特殊活動折抵的話則全部移除
      if (parseInt(orderDiscount) > 0) {
        $('.offset_area').remove()
      } else {
        $('.offsetCtrl_coupon').remove()
        $('.offsetCtrl_alert').remove()
        $('.offsetCtrl_happyGoPoint').remove()
        $('.offsetCtrl_welfarePoint').remove()
        $('.offsetCtrl_FCoin').remove()
        $('.offsetCtrl_discountCode').show()
      }
    }

    //定義:切換年月日從新取值
    var firstBirthday_fn = function () {
      var memberBirthday = $('#memberBirthday').val()

      if (memberBirthday) {
        memberBirthday = memberBirthday
          .replace('-', '/')
          .replace('-', '/')
          .replace('-', '/')
        $('#firstBirthday').val(memberBirthday)
      } else {
        console.log(memberBirthday)
        console.log('生日資料異常')
      }
    }
    firstBirthday_fn()

    //事件:切換生日的- 月份
    $('#memberBirthday').change(function () {
      firstBirthday_fn()
    })

    $('.firstOrderpeople_area').off('focusout', 'input[type=date]')
    $('.firstOrderpeople_area').on('focusout', 'input[type=date]', function () {
      firstBirthday_fn()
    })

    //資料連動
    if (memberInfoIncomplete) {
      if (isVisitor) {
        //訪客專屬行為  電話註冊檢查
        $('.firstMobile').change(function () {
          // checkMphoneUsage($('.firstMobile').val())
        })
      }

      // 訂購人姓名連動
      $('.firstName').change(function () {
        if ($('#consigneeDefaultCheckbox').prop('checked')) {
          //$(".consigneeName").val($('.firstName').val());
          $('#consigneeDefaultCheckbox').prop('checked', false)
        }
      })

      // 訂購電郵連動
      $('.firstEmail').change(function () {
        if ($('#consigneeDefaultCheckbox').prop('checked')) {
          //$(".consigneeEmail").val($('.firstEmail').val())
          $('#consigneeDefaultCheckbox').prop('checked', false)
        }
      })

      // 訂購人詳細地址連動
      $('.firstOrderpeople_area')
        .find('input')
        .change(function () {
          if ($('#consigneeDefaultCheckbox').prop('checked')) {
            //$(".consigneeRoad").val($('.firstRoad').val())
            $('#consigneeDefaultCheckbox').prop('checked', false)
          }
        })

      // 訂購人地址選擇連動
      $('.firstOrderpeople_area')
        .find('select')
        .change(function () {
          if ($('#consigneeDefaultCheckbox').prop('checked')) {
            /*var countyId = $("#firstRegion").val().split(",")[0]
                var cityId = $("#firstCity").val()
                $("#consigneeCity option[value='"+ cityId +"']").prop("selected", true);
                getCountryOptions('consigneeRegion', cityId, countyId);*/
            $('#consigneeDefaultCheckbox').prop('checked', false)
          }
        })
    }

    /*if ($('.firstEmail')
      .size() > 0) {
      $(".firstEmail")
        .change(function() {
          checkEmailUsage($('.firstEmail')
            .val())
        })
    }*/
  }

  $('.consigneeContent_area')
    .find('input[type!=checkbox]')
    .change(function () {
      $('#consigneeDefaultCheckbox').prop('checked', false)
    })

  $('.consigneeContent_area')
    .find('select')
    .change(function () {
      $('#consigneeDefaultCheckbox').prop('checked', false)
    })

  //定義:快取"訂購人資料"方法, (資料來源由後端人員產生在jsp中的欄位取)
  function catchOrderpeople_fn() {
    var getData = {}
    //判斷是否為首購
    if ($('.firstOrderpeople_area').size() > 0) {
      //是
      getData.Name = $('.firstOrderpeople_area .firstName').val()
      getData.City = $('.firstOrderpeople_area .firstCity').val()
      getData.CityTxt = $(
        '.firstOrderpeople_area .firstCity option:selected'
      ).text()
      getData.Region = $('.firstOrderpeople_area .firstRegion').val()
      getData.RegionTxt = $(
        '.firstOrderpeople_area .firstRegion option:selected'
      ).text()
      getData.Road = $('.firstOrderpeople_area .firstRoad').val()
      getData.Sex = $(".firstOrderpeople_area input[name='firstSex']").val()
      getData.Mobile = $('.firstOrderpeople_area .firstMobile').val()
      getData.Tel = $('.firstOrderpeople_area .firstTel').val()
      getData.Email = $('.firstOrderpeople_area .firstEmail').val()
    } else {
      //否
      getData.Name = $('.orderpeople_area .tr:eq(0)').find('.td').text()
      getData.Mobile = $('.orderpeople_area .tr:eq(1)').find('.td').text()
      getData.Tel = $('.orderpeople_area .tr:eq(2)').find('.td').text()
      getData.address = $('.orderpeople_area .tr:eq(3)').find('.td').text()
      getData.Email = $('.orderpeople_area .tr:eq(4)').find('.td').text()
    }
    return getData
  }

  //定義:清空收貨人UI預設值方法
  var consigneeResetUI_fn = function () {
    //ckeckbox, radio btn
    $('#consigneeDefaultCheckbox').prop('checked', false) //右上角同訂購人資料
    $('#addOftenPeopleCheckbox_consignee').prop('checked', false) //新增至常用收貨人

    //select
    if (citysuperAddress != 'citysuper店取商品') {
      $('#consigneeDifferent_Content select')
        .find('option:first')
        .prop('selected', 'selected') //所有下拉選單
      $('#consigneeRegion option').remove() //地址-區域
    }
    //text
    $(
      "#consigneeDifferent_Content input[type='text'], #consigneeDifferent_Content input[type='tel'], #consigneeDifferent_Content input[type='email']"
    ).val('') //所有輸入欄位
  }
  consigneeResetUI_fn()
  //事件:收貨人右上角同訂購人資料的checkbox
  $('#consigneeDefaultCheckbox').change(function () {
    var getChecked = $(this).prop('checked')
    if (!getChecked) {
      $('#consigneeDifferent_Content').show()
    } else {
      if (memberCityId == '') {
        //若訂購人是訪客
        $.each($('#consigneeCity option'), function () {
          if ($(this).val() == $('#firstCity').val()) {
            var firstRegion = $('#firstRegion option:selected').text()
            if (
              firstRegion == '琉球鄉' ||
              firstRegion == '綠島鄉' ||
              firstRegion == '蘭嶼鄉'
            ) {
              openShippingForm = true
            } else {
              openShippingForm = false
              return false
            }
          } else {
            openShippingForm = true
          }
        })
      } else {
        // 當是訂購人是外島時, 不得同訂購人
        $.each($('#consigneeCity option'), function () {
          if ($(this).val() == memberCityId) {
            //區域為外島時，打開收貨人表單，琉球鄉 296/綠島鄉 318/蘭嶼鄉 323
            if (
              memberCountyId == '296' ||
              memberCountyId == '318' ||
              memberCountyId == '323'
            ) {
              openShippingForm = true
            } else {
              openShippingForm = false
              return false
            }
          } else {
            openShippingForm = true
          }
        })
      }

      if (memberInfoIncomplete) {
        //按鈕只影響是否同步資料  頁面無行為
        if ($(this).prop('checked')) {
          $('.consigneeName').val($('.firstName').val())
          $('.consigneeEmail').val($('.firstEmail').val())
          $('.consigneeMobile').val($('.firstMobile').val())
          $('.consigneeTel').val($('.firstTel').val())
          if (!!$('#firstRegion').val()) {
            var countyId = $('#firstRegion').val().split(',')[0]
            var cityId = $('#firstCity').val()
            $("#consigneeCity option[value='" + cityId + "']").prop(
              'selected',
              true
            )
            getCountryOptions('consigneeRegion', cityId, countyId)
            $('.consigneeRoad').val($('.firstRoad').val())
          }
        }
      } else if (openShippingForm && citysuperAddress != 'citysuper店取商品') {
        $('#consigneeDefaultCheckbox').prop('checked', false)
        alert('限台灣本島、不接受郵政信箱')
        return false
      } else {
        if ($(this).prop('checked')) {
          syncConsignee_data()
        }
      }
    }
  })

  // 收貨人資料同訂購人資料連動function
  var syncConsignee_data = function () {
    $('.consigneeName').val(memberName)
    $('.consigneeEmail').val(memberEmail)
    $('.consigneeMobile').val(memberPhone)
    $('.consigneeTel').val($('.firstTel').val())
    $("#consigneeCity option[value='" + memberCityId + "']").prop(
      'selected',
      true
    )
    getCountryOptions('consigneeRegion', memberCityId, memberCountyId)
    $('.consigneeRoad').val(memberRoad)
  }

  //訂購人資料的地址選擇外島時，收貨人資料欄位打開
  $('#firstCity').change(function () {
    //連江縣-3/金門縣-4/澎湖縣-20
    if (
      $('#firstCity').val() == 3 ||
      $('#firstCity').val() == 4 ||
      $('#firstCity').val() == 20
    ) {
      $('#consigneeDefaultCheckbox').prop('checked', false)
      $('#consigneeDifferent_Content').show()
    }
  })
  $('#firstRegion').change(function () {
    //連江縣-3/金門縣-4/澎湖縣-20
    //琉球鄉-296,929/綠島鄉-318,951/蘭嶼鄉-323,952
    if (
      $('#firstCity').val() == 3 ||
      $('#firstCity').val() == 4 ||
      $('#firstCity').val() == 20 ||
      $('#firstRegion').val() == '296,929' ||
      $('#firstRegion').val() == '318,951' ||
      $('#firstRegion').val() == '323,952'
    ) {
      $('#consigneeDefaultCheckbox').prop('checked', false)
      $('#consigneeDifferent_Content').show()
    }
  })

  //隱藏收件人地址區域的外島選項
  $('#consigneeCity').change(function () {
    if ($('#consigneeCity option:selected').text() == '屏東縣') {
      //隱藏 琉球鄉
      //$("#consigneeRegion option[value='296,929']").hide()
      $("#consigneeRegion option[value='296,929']").remove()
    }
    if ($('#consigneeCity option:selected').text() == '臺東縣') {
      //隱藏 綠島鄉
      //$("#consigneeRegion option[value='318,951']").hide()
      $("#consigneeRegion option[value='318,951']").remove()
      //隱藏 蘭嶼鄉
      //$("#consigneeRegion option[value='323,952']").hide()
      $("#consigneeRegion option[value='323,952']").remove()
    }
  })

  //事件:切換發票捐贈單位
  $("input[name='agency']").change(function () {
    var getID = $(this).attr('id')
    $("input[name='invodonateid']").val(getID)
  })

  //事件:點擊更多商品明細按鈕
  $('.lookmorePrd').click(function () {
    if (mGH.isDialog) {
      return false
    }
    mGH.isDialog = true
    //載入jsp頁後使用dialog套件
    $('body').append(
      "<div id='temp_popup_prdList' style='display:none;'></div>"
    )

    //將進step2時的暫存jession補上，避免中途發生jession發生變異，導致無法結帳
    var testjs = GetUTF8Cookie('JSESSIONID-test')

	  if(testjs != "null"){        
	      $.cookie('JSESSIONID', testjs,{path: '/mobileweb'});
	  }
	
      //$("#temp_popup_prdList").load("popup_prdlist.jsp", {}, function(){ //local端測試用
      $("#temp_popup_prdList").load("/mobileweb/checkout/popupPrdlist", {}, function() {
          mGH.isDialog = false;
          $(this)
            .feecdialog({
              "titleTxt": "訂購商品明細",
              "titleIshide": false,
              "closeBtnIshide": false,
              "isBgClose": false,
              "yesBtnIsShow": false,
              "noBtnIsShow": false,
              "isCenter": false,
              "width": '100%',
              "height": '95%',
              "infoBody": $("#temp_popup_prdList")
                .html(),
              "animateToTop": true,
              "isAnimate": true,    
              "dialogatbottom": true,
              "backgroundDOM": '#m_content_area',
              "onReady": function onReady() {
              	//畫面上selCouponAmountList的值
              	var selCouponList =$('input[name=selCouponAmountList]').val();
      			if (selCouponList != null && selCouponList != '') {
      				//用逗號區隔每筆訂單
      				var selCoupon = selCouponList.split(",");
      				//papa中畫面塞入的orderid,做比對使用
      				$("input[name=orderid]").each(
      						function(index) {
      							for (var i = 0; i < selCoupon.length; i++) {
      								var orderId = selCoupon[i].split(':')[0]; //訂單編號
      								var amount = selCoupon[i].split(':')[1];  //折價金額
      								if (amount != 0){
	      								if ($(this).val() == orderId) {
	      									$(this).parents('.popup_detail').find(".coupon_money").text("-$" + amount);
	      									$(this).parents('.popup_detail').find(".coupon_money").parents('.color_red').show();
	      								}
      								}	
      							}
      						})
                }
        },
      })
      $('#temp_popup_prdList').remove()
    })
  })

  //事件:點擊適用銀行按鈕
  $('.lookbank').click(function () {
    if (mGH.isDialog) {
      return false
    }
    mGH.isDialog = true
    //載入jsp頁後使用dialog套件
    $('body').append(
      "<div id='temp_popup_bankList' style='display:none;'></div>"
    )
    //$("#temp_popup_bankList").load("popup_banklist.jsp", {}, function(){ //local端測試用
    $('#temp_popup_bankList').load('popupBanklist', {}, function () {
      mGH.isDialog = false
      $(this).feecdialog({
        titleTxt: '適用銀行',
        titleIshide: false,
        closeBtnIshide: false,
        isBgClose: false,
        yesBtnIsShow: false,
        noBtnIsShow: false,
        isCenter: false,
        width: '70%',
        height: '85%',
        infoBody: $('#temp_popup_bankList').html(),
        isAnimate: false,
        onReady: function () {
          $('#point_deductible_banks_box >p').html(
            $.trim($('#point_deductible_banks').text())
          )
        },
      })

      $('#temp_popup_bankList').remove()
    })
  })

  //事件:點擊各種付款方式按鈕
  $('.paytype').click(function (event) {
    //勾選付款方式的radio button
    $(this).find('input[type=radio]').prop('checked', true)

    $('.paylist .credit-card-selection').remove()  //關閉信用卡展開區域
    $('.paylist .line-selection').removeClass('on')  //隱藏linePay展開區域
    if ($(this).attr('class').startsWith('PAYTYPE_CARD')) {  //選擇方式為信用卡相關時
      $(this).after($('.creditCardList').html()) //將信用卡展開區塊中的資料append到畫面中

      if (
        $(this).attr('class').startsWith('PAYTYPE_CARD_1 paytype') ||
        $(this).attr('class').startsWith('PAYTYPE_CARDC_1 paytype')
      ) {
        $('.credit-card-selection:eq(0) .mt-1').hide()
      }
      $('.add-credit-card.evt-open-popup').on('click', function (e) { //新增信用卡button點擊
        $('.card-control-box.add-border').find('input').val('')
        if (member_active_status != 4) {
          //訪客不檢查
          checkMemberCreditCardAmount()
        }
        popAction(e, $(this)) //顯示新增信用卡popup
      })

      // input radio - icon-radio-value
      $('.change-payment-opts-box .credit-card-selection .icon-radio').on('click', function () { 
        var parents = $(this).closest('.popup-box')
        var allopts = $('.credit-card-selection').find('.icon-radio')
        allopts.removeClass('in')
        $(this).addClass('in')
        parents.find('.credit-card-selection .icon-value').val($('.icon-radio').index($(this)) + 1)

        var id = $(this)
          .parents('.credit-card-items')
          .find('.tempcardExpressCheckoutId')
          .val()

        $('.' + id)
          .parent()
          .find('.icon-radio')
          .addClass('in')
      })
    }else if($(this).attr('class').startsWith('PAYTYPE_LINE')){  //選擇付款方式為line時
      $('.paylist .line-selection').addClass('on'); //line信用卡區塊展開
    }

    $('.paytype').removeClass('active')
    $(this).addClass('active')

    //   if($("#payTypeName").val() != 'PAYTYPE_STOR_1') { // 不是到店付款的話要清空原本的超商選擇 {計畫有變!!這段也許可以不用做}
    // 	storeResetUI_fn()
    //   }
    //cardform_area一般信用卡,  fastCardform_area快速結帳,  store_area超商
    $('.cardform_area, .fastCardform_area, .store_area').hide()

    //當全額折抵時
    if ($('#pay_type_pay_done_0').css('display') == 'none') {
      $('.card_area').show() //一整個付款方式大區塊
      $('.FastCtrl_area').show()
    }
    $('#agreementFastCheckbox').prop('checked', true)

    //是否有快速結帳身分
    if ($('.fastCardform_area').length > 0) {
      //有
      $('.fastCardform_area').show()
    } else {
      //無
      $('.cardform_area').show()
    }

    //執行ATM結帳流程 or 全額折抵介面
    if (
      $('input[name=paytype]:checked').attr('id') == 'atmBtn' ||
      $('input[name=paytype]:checked').attr('id') == 'fullAmount_offset' ||
      $('input[name=paytype]:checked').attr('id') == 'LINE' ||
      $('input[name=paytype]:checked').attr('id') == 'HGPAY' ||
      $('input[name=paytype]:checked').attr('id') == 'JKO' ||
      $('input[name=paytype]:checked').attr('id') == 'fullAmount_offset2'
    ) {
      $('.card_area').hide()
      $('.FastCtrl_area').hide()
    } else {
      $('.card_area').show()
      if (citysuperAddress != 'citysuper店取商品') {
        $('.FastCtrl_area').show()
      } else {
        $('.FastCtrl_area').hide()
      }
    }

    //執行選擇超商流程介面
    if (
      $(this).attr('id') == 'storeBtn' &&
      $("input[name='cartTypeId']").val() == 4
    ) {
      $('.card_area').hide()
      $('.FastCtrl_area').hide()
      storeInit_fn()
    }

    //若資料不完全則 隱藏fastCheckout
    if ($('.firstOrderpeople_area').size() > 0) {
      if ($('.FastCtrl_area').size() > 0) {
        $('.FastCtrl_area').hide() // 先隱藏
      }
    }
    //信用卡高分期 -- START
    //console.log('You clicked radio!:'+$("input[name='paytype']:radio:checked").val())
    var varForPaymentRadio = $("input[name='paytype']:radio:checked").val()
    if (varForPaymentRadio.indexOf('PAYTYPE_CARDI') >= 0) {
      var targetNameForInterestAmt = 'interestAmt' + varForPaymentRadio
      var targetNameForInterestRate = 'interestRate' + varForPaymentRadio
      //console.log('get targetName :'+targetName)
      $("input[name='interestAmt']").val(
        $('input[name=' + targetNameForInterestAmt + ']').val()
      )
      $("input[name='interestRate']").val(
        $('input[name=' + targetNameForInterestRate + ']').val()
      )
    } else {
      $("input[name='interestAmt']").val(0)
      $("input[name='interestRate']").val(0)
    }
    //信用卡高分期 -- END
  })
  
  let payListItem = $('.paylist .visitorPayType')
  if(payListItem && payListItem.length === 1 && $(payListItem[0]).hasClass('PAYTYPE_CARD_1')){  //若只有一個選項且為信用卡時不隱藏信用卡區塊，其他狀況都隱藏起來
    $('.cardInputArea').show(); 
  }
  

  //訪客付款方式radio點擊事件
  $('.visitorPayType').click(function(event){   
    $(this).find('input[type=radio]').prop('checked', true)

    $('.visitorPayType').removeClass('active') //其餘的移除選取狀態
    $(this).addClass('active') //點擊的加入選取狀態

    if($(this).hasClass('PAYTYPE_CARD_1')){  //點選信用卡radio時展開信用卡填寫區塊並清空信用卡填寫區域的錯誤訊息
      $('.cardInputArea .card-form-input').removeClass('error') 
      $('.errorText').html('')  
      $('.cardInputArea').slideDown()
    }else{
      $('.cardInputArea').slideUp()
    }
    //信用卡高分期 -- START
    // console.log('You clicked radio!:'+$("input[name='paytype']:radio:checked").val())
    var varForPaymentRadio = $("input[name='paytype']:radio:checked").val()
    if (varForPaymentRadio.indexOf('PAYTYPE_CARDI') >= 0) {
      var targetNameForInterestAmt = 'interestAmt' + varForPaymentRadio
      var targetNameForInterestRate = 'interestRate' + varForPaymentRadio
      //console.log('get targetName :'+targetName)
      $("input[name='interestAmt']").val(
        $('input[name=' + targetNameForInterestAmt + ']').val()
      )
      $("input[name='interestRate']").val(
        $('input[name=' + targetNameForInterestRate + ']').val()
      )
    } else {
      $("input[name='interestAmt']").val(0)
      $("input[name='interestRate']").val(0)
    }
  })

  // 事件:選擇付款方式
  $('.change-payment-opts-box .card-button').click(function (event) {
    if (  //若選取信用卡但沒有設定過信用卡
      $('.paytype.active').attr('class').startsWith('PAYTYPE_CARD') &&
      $('.credit-card-items').size() == 0
    ) {
      alert('尚未填寫信用卡資訊!')
    } else {
      $(this).parent('.popup-box').removeClass('in')
      toggleHtml(false)
      choiseCard(false)
      if ('2' == cartTypeId) {
        creatSelectStoreInfo()
      }
    }
  })

  $('.select-smark-box .card-button').click(function (event) {
    var storeInfo = $('.select-smark-box .icon-radio.in')
      .parents('.super-market-items')
      .find('.storeInfo')
    var storeStatus = storeInfo.attr('storeStatus')
    selectStoreId = storeInfo.attr('expressCheckoutId')
    $(this).parent('.popup-box').removeClass('in')
    toggleHtml(false)
    creatSelectStoreInfo()
    // if(storeStatus == 1){
    // }else{
    //     alert("超商已失效");
    // }
  })

  function checkStoreDisplay() {
    disableAllAddStoreFormButton()
    var isStorePay = $('.paytype.active')
      .attr('class')
      .startsWith('PAYTYPE_STOR_1')
    var isPaytypeDone = $('.paytype.active')
      .attr('class')
      .startsWith('PAYTYPE_DONE_0')
    // orderDelivery定義於step2.jsp
    if (orderDelivery.indexOf('STORE') >= 0) {
      enableAddStoreFormCVSButton()
    }
    if (orderDelivery.indexOf('DE') >= 0) {
      enableAddStoreFormDEButton()
    }
    if (orderDelivery.indexOf('FET') >= 0) {
      enableAddStoreFormFetnetButton()
    }
    // 超商取貨付款>遠傳門市不適用
    if (isStorePay) {
      disableAddStoreFormDEButton()
      disableAddStoreFormFetnetButton()
    } else {
      // 任一小訂單超過4000，超商只能取貨付款
      if (!isPaytypeDone) {
        $.each($('.orderAmount'), function () {
          if ($(this).val() > 4000) {
            disableAddStoreFormCVSButton()
          }
        })
      }
    }
  }

  function resetAddStoreFormButtonStatus() {
    var storeIds = [1, 2, 8, 9] // 7-11=1, 全家=2, 德誼=8, 遠傳=9
    storeIds.forEach((storeId) => {
      $('.supcomm-form-input .supmkt_card_type_' + storeId)
        .parent()
        .attr('onclick', 'getStoreMap(' + storeId + ')')
      $('.supcomm-form-input .supmkt_card_type_' + storeId)
        .parent()
        .css('opacity', '')
      $('.supcomm-form-input .supmkt_card_type_' + storeId)
        .siblings('input')
        .show()
    })
  }

  function disableAddStoreForm711Button() {
    disableAddStoreFormButtonByType(1)
  }

  function disableAddStoreFormFamilyButton() {
    disableAddStoreFormButtonByType(2)
  }

  function disableAddStoreFormDEButton() {
    disableAddStoreFormButtonByType(8)
  }

  function disableAddStoreFormFetnetButton() {
    disableAddStoreFormButtonByType(9)
  }

  function disableAddStoreFormCVSButton() {
    disableAddStoreForm711Button()
    disableAddStoreFormFamilyButton()
  }

  function disableAllAddStoreFormButton() {
    disableAddStoreFormCVSButton()
    disableAddStoreFormDEButton()
    disableAddStoreFormFetnetButton()
  }

  function disableAddStoreFormButtonByType(storeType) {
    $('.supcomm-form-input .supmkt_card_type_' + storeType)
      .parent()
      .removeAttr('onclick')
    $('.supcomm-form-input .supmkt_card_type_' + storeType)
      .parent()
      .css('opacity', 0.5)
    $('.supcomm-form-input .supmkt_card_type_' + storeType)
      .siblings('input')
      .hide()
  }

  function enableAddStoreForm711Button() {
    enableAddStoreFormButtonStatus(1)
  }

  function enableAddStoreFormFamilyButton() {
    enableAddStoreFormButtonStatus(2)
  }

  function enableAddStoreFormDEButton() {
    enableAddStoreFormButtonStatus(8)
  }

  function enableAddStoreFormFetnetButton() {
    enableAddStoreFormButtonStatus(9)
  }

  function enableAddStoreFormCVSButton() {
    enableAddStoreForm711Button()
    enableAddStoreFormFamilyButton()
  }

  function enableAddStoreFormButtonStatus(storeType) {
    $('.supcomm-form-input .supmkt_card_type_' + storeType)
      .parent()
      .attr('onclick', 'getStoreMap(' + storeType + ')')
    $('.supcomm-form-input .supmkt_card_type_' + storeType)
      .parent()
      .css('opacity', '')
    $('.supcomm-form-input .supmkt_card_type_' + storeType)
      .siblings('input')
      .show()
  }

  //事件:開啟超商電子地圖
  $('#store .evt-open-popup').click(function (e) {
    checkStoreDisplay()
    if ($('.super-market-items').length == 0) {
      $('.select-smark-box .evt-open-popup').click()
    } else {
      if ($('.super-market-items').length >= 10) {
        $('.add-supcomm-box .card-form-desc.save').hide()
        $('.add-supcomm-box .card-form-desc.isLimit').show()
        $('.add-supcomm-box .card-control').hide()
        $('.add-supcomm-box .icon-single-checkbox').removeClass('in')
      }
      popAction(e, $(this))
      getMemberStore()
    }
  })

  //事件:點擊超商取貨流程左上角回上頁按鈕
  $('.storebackBtn').click(function () {
    var nowStoreStep = $(this).attr('nowStoreStep')

    if (nowStoreStep == 1) {
      $('.step2_area').removeClass('forStore')
      $('body').css('overflow', 'auto')
      scrollTo(0, mGH.scrolled) //取出原本的catch scroll
      resize_fn()
    }

    if (nowStoreStep == 2) {
      nowStoreStep--
      $(this).attr('nowStoreStep', nowStoreStep)
      cvsCity_fn()
    }

    if (nowStoreStep == 3) {
      nowStoreStep--
      $(this).attr('nowStoreStep', nowStoreStep)
      cvsRegion_fn()
    }

    if (nowStoreStep == 4) {
      nowStoreStep--
      $(this).attr('nowStoreStep', nowStoreStep)
      cvsRoad_fn()
    }

    if (nowStoreStep == 5) {
      nowStoreStep--
      $(this).attr('nowStoreStep', nowStoreStep)
      cvsStoreList_fn()
    }
  })

  //定義:清空超商表單欄位
  var storeResetUI_fn = function () {
    $("input[name='srvno']").val('')
    $("input[name='storeaddress']").val('')
    $("input[name='storename']").val('')
    $('.forstorename').text('')
    $('.forstoreaddress').text('')
  }

  //定義:超商流程介面初始化方法
  var storeInit_fn = function () {
    $('.store_area').show()

    //catch body scroll
    mGH.scrolled = $(window).scrollTop()
    $('.step2_area').addClass('forStore')
    scrollTo(0, 0) //將body回最上面

    //換算超商介面可視div高度
    var getWH = $('body').height() - 130
    $('.storeFloat_area .storeBox').height(getWH)

    $('body').css('overflow', 'hidden') //body不給scroll
    //撈取便利達康超商資料
    if (mGH.cvsCity == null) {
      callRESTAPI({
        method: 'GET',
        path: mGH.apiService + 'api/cvs/list', //UAT
        callback: function (msg) {
          try {
            msg = JSON.parse(msg)
          } catch (e) {}
          mGH.cvsCity = msg.data[0]
          cvsCity_fn()
        },
      })
    } else {
      cvsCity_fn()
    }
  }

  //定義:組便利達康city
  var cvsCity_fn = function () {
    $('.storeContent').html('')
    $('.storeBox h5').html('請選擇：')
    var BOX = $('<div/>')
    $.each(mGH.cvsCity, function (i, item) {
      var btn = $('<input/>')
        .attr('type', 'button')
        .attr('value', item)
        .addClass('cityBtn')
      BOX.append(btn)
    })
    $('.storeContent').append(BOX.html())
    $('.storePath').html('目前位置> ')
    //註冊事件撈取鄉鎮市區資料
    $('.cityBtn').click(function () {
      var cityName = $(this).attr('value')
      callRESTAPI({
        method: 'GET',
        path: mGH.apiService + 'api/cvs/list/' + cityName,
        callback: function (msg) {
          try {
            msg = JSON.parse(msg)
          } catch (e) {}
          var nowStoreStep =
            parseInt($('.storebackBtn').attr('nowStoreStep'), 10) + 1
          $('.storebackBtn').attr('nowStoreStep', nowStoreStep)

          mGH.cvsRegion = msg.data[0]
          mGH.cvsCityName = cityName
          cvsRegion_fn()
        },
      })
    })
  }

  //定義:組便利達康region
  var cvsRegion_fn = function () {
    $('.storeContent').html('')
    $('.storeBox h5').html('請選擇：')
    var BOX = $('<div/>')
    $.each(mGH.cvsRegion, function (i, item) {
      var btn = $('<input/>')
        .attr('type', 'button')
        .attr('value', item)
        .addClass('regionBtn')
        .attr('city', mGH.cvsCityName)
      BOX.append(btn)
    })
    $('.storeContent').append(BOX.html())
    $('.storePath').html('目前位置> ' + mGH.cvsCityName)
    //註冊事件撈取路名資料
    $('.regionBtn').click(function () {
      var regionName = $(this).attr('value')
      callRESTAPI({
        method: 'GET',
        path:
          mGH.apiService + 'api/cvs/list/' + mGH.cvsCityName + '/' + regionName,
        callback: function (msg) {
          try {
            msg = JSON.parse(msg)
          } catch (e) {}
          var nowStoreStep =
            parseInt($('.storebackBtn').attr('nowStoreStep'), 10) + 1
          $('.storebackBtn').attr('nowStoreStep', nowStoreStep)
          mGH.cvsRoad = msg.data[0]
          mGH.cvsRegionName = regionName
          cvsRoad_fn()
        },
      })
    })
  }

  //定義:組便利達康road
  var cvsRoad_fn = function () {
    $('.storeContent').html('')
    $('.storeBox h5').html('請選擇：')
    var BOX = $('<div/>').addClass('table')
    var k = 0
    $.each(mGH.cvsRoad, function (i, item) {
      if (k % 3 == 0) {
        BOX.append("<div class='row'></div>")
      }
      var btn = $('<div/>')
        .text(item)
        .addClass('roadBtn')
        .attr('city', mGH.cvsCityName)
        .attr('region', mGH.cvsRegionName)
      BOX.find('.row:last').append(btn)
      k++
    })
    $('.storeContent').append(BOX)
    $('.storePath').html(
      '目前位置> ' + mGH.cvsCityName + '> ' + mGH.cvsRegionName
    )
    //註冊事件:撈取便利商店地址列表
    $('.roadBtn').click(function () {
      var roadName = $(this).text()
      callRESTAPI({
        method: 'GET',
        path:
          mGH.apiService +
          'api/cvs/list/' +
          mGH.cvsCityName +
          '/' +
          mGH.cvsRegionName +
          '/' +
          roadName,
        callback: function (msg) {
          try {
            msg = JSON.parse(msg)
          } catch (e) {}
          var nowStoreStep =
            parseInt($('.storebackBtn').attr('nowStoreStep'), 10) + 1
          $('.storebackBtn').attr('nowStoreStep', nowStoreStep)
          mGH.cvsStore = msg.data[0]
          mGH.cvsRoadName = roadName
          cvsStoreList_fn()
        },
      })
    })
  }

  //定義:組便利達康store list
  var cvsStoreList_fn = function () {
    $('.storeContent').html('')
    $('.storeBox h5').html('請選擇超商門市：').show()
    $('.storePath').show()
    var BOX = $('<div/>')
    $.each(mGH.cvsStore, function (i, item) {
      var h6 = $('<h6/>').text(item.name)
      var p = $('<p/>').append(item.city + item.region + item.address)
      var list = $('<div/>')
        .addClass('storeList')
        .attr('srvno', item.srv_no)
        .append(h6)
        .append(p)
      BOX.append(list)
    })
    $('.storeContent').append(BOX.html())
    $('.storePath').html(
      '目前位置> ' +
        mGH.cvsCityName +
        '> ' +
        mGH.cvsRegionName +
        '> ' +
        mGH.cvsRoadName
    )
    //註冊事件:撈取便利商店詳細資料
    $('.storeList').click(function () {
      var srvno = $(this).attr('srvno')
      callRESTAPI({
        method: 'GET',
        path:
          mGH.apiService + 'api/cvs/info?srv_no=' + srvno + '&format=pretty',
        callback: function (msg) {
          try {
            msg = JSON.parse(msg)
          } catch (e) {}
          var nowStoreStep =
            parseInt($('.storebackBtn').attr('nowStoreStep'), 10) + 1
          $('.storebackBtn').attr('nowStoreStep', nowStoreStep)
          $('.storeContent').html('')
          $('.storeBox h5, .storePath').hide()

          var data = msg.data[0]
          mGH.srvno = srvno
          mGH.storeName = data.name
          mGH.svcAddress = data.city + data.region + data.address
          var p1 = $('<p/>')
              .addClass('tr')
              .html(
                "<span class='th'>門市名稱：</span> <span class='td'>" +
                  data.name +
                  '</span>'
              ),
            p2 = $('<p/>')
              .addClass('tr')
              .html(
                "<span class='th'>門市地址：</span> <span class='td'>" +
                  mGH.svcAddress +
                  '</span>'
              )

          var btnArea = $('<div/>').addClass('btnarea'),
            nobtn = $('<input/>')
              .attr('type', 'button')
              .attr('value', '重新選擇')
              .addClass('noBtn'),
            yesbtn = $('<input/>')
              .attr('type', 'button')
              .attr('value', '確認門市')
              .addClass('yesBtn')
          btnArea.append(nobtn, yesbtn)

          var Map = $('<div/>').attr('id', 'map_canvas').addClass('map-canvas')
          $('.storeContent').append(p1, p2, btnArea, Map)

          //註冊按鈕事件
          $('.yesBtn').click(storeYesBtn_fn)
          $('.noBtn').click(storeNoBtn_fn)

          //google
          if (window['google'] == null) {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.src =
              '//maps.googleapis.com/maps/api/js?v=3&sensor=true&' +
              'callback=getLatLngByAddr' //注意getLatLngByAddr 是載入js後的 callback
            document.body.appendChild(script)
          } else {
            getLatLngByAddr()
          }
        },
      })
    })
  }

  //定義:超商確認事件方法
  var storeYesBtn_fn = function () {
    $("input[name='srvno']").val(mGH.srvno)
    $("input[name='storeaddress']").val(mGH.svcAddress)
    $("input[name='storename']").val(mGH.storeName)
    $('.forstorename').text(mGH.storeName)
    $('.forstoreaddress').text(mGH.svcAddress)
    $('.storebackBtn').attr('nowstorestep', 1).click()
    resize_fn()
  }

  //定義:超商取消事件方法事件方法
  var storeNoBtn_fn = function () {
    $('.storebackBtn').click()
  }

  //事件:點擊超商取貨付款按鈕
  $('.lookStore').click(function () {
    if ($("input[name='cartTypeId']").val() == 4) {
      storeInit_fn()
    }
  })

  //事件:常用收貨人按鈕(注意有區分:收貨人跟發票收件人各有一顆)
  $('.lookOftenPeople').click(function () {
    if (mGH.isDialog) {
      return false
    }
    mGH.isDialog = true
    var getId = $(this).attr('id')
    //載入jsp頁後使用dialog套件
    $('body').append(
      "<div id='temp_popup_oftenPeopleList' style='display:none;'></div>"
    )
    //$("#temp_popup_oftenPeopleList").load("popup_oftenpeoplelist.jsp", {}, function(){ //local端測試用
    $('#temp_popup_oftenPeopleList').load(
      'popupOftenpeoplelist',
      {},
      function () {
        mGH.isDialog = false
        $(this).feecdialog({
          titleTxt: '常用收貨人',
          titleIshide: false,
          closeBtnIshide: false,
          isBgClose: false,
          yesBtnIsShow: false,
          noBtnIsShow: false,
          isCenter: false,
          width: '70%',
          height: '85%',
          infoBody: $('#temp_popup_oftenPeopleList').html(),
          isAnimate: false,
          onReady: function () {
            //收貨人
            if (getId == 'forConsignee') {
              $('.popup_oftenpeoplelist').attr('returnForm', 'forConsignee')
            }
            //發票收件人
            if (getId == 'forInvoice') {
              $('.popup_oftenpeoplelist').attr('returnForm', 'forInvoice')
            }
          },
        })
        $('#temp_popup_oftenPeopleList').remove()
      }
    )
  })

  //=================================================折抵區塊==================================================
  //預設把"價格總計"下的"優惠折扣碼折抵" 等隱藏
  //  $("#calcCoupon, #calcWelfarePoint, #calcHGPoint, #calcFCoin")
  //    .parent(".tr")
  //    .hide()

  //折抵區塊清空
  $(
    '#offset_coupon,  #offset_discountCode, #offset_welfarePoint, #offset_happyGoPoint , #offset_FCoin'
  ).prop('checked', false)
  $('.offset_area .right').val('')

  //定義:快樂購卡點數折抵的dialog方法
  var HGPoint_dlalog = function () {
    //載入jsp頁後使用dialog套件
    $('body').append(
      "<div id='temp_popup_HGPoint' style='display:none;'></div>"
    )

    //於第一次開啟時固定dialog大小（修正畫面無限拉長問題）
    var windowW = $(window).width(),
      windowH = $(window).height()
    var dialogHeight = windowH * 0.6 //60%
    var dialogWidth = windowW * 0.7 //70%

    $('#temp_popup_HGPoint').load('popupHGPoint', {}, function () {
      //改變套件css樣式
      var style =
        '' +
        '<style>table{width:100%; height:100%;} td{border:1px solid red; height:50%;}' +
        '.feecdialog_area .yesBtn{background-color:#ffa800 !important; box-shadow: 0 0 0 !important; width:95% !important;}' +
        '</style>'
      $('#temp_popup_HGPoint').append(style)

      $(this).feecdialog({
        titleTxt: '快樂購物卡點數',
        titleIshide: false,
        closeBtnIshide: false,
        isBgClose: false,
        yesBtnWord: '確定送出',
        yesBtnIsShow: true,
        noBtnIsShow: false,
        isAutoClose: false,
        yesFn: function () {
          var getVal = Math.floor($('#HGPoint').val())
          var maxHGPrice = $('#maxHGPrice').text()

          if (getVal <= 0) {
            alert('金額不可小於0')
            return false
          }

          if (isNaN(getVal)) {
            alert('金額不可輸入非數字')
            return false
          }

          //折抵金額依據
          var ratioP = parseInt(
              $('.offsetCtrl_happyGoPoint .note span:first').text(),
              10
            ),
            ratioM = parseInt(
              $('.offsetCtrl_happyGoPoint .note span:last').text(),
              10
            )

          if (getVal < ratioM) {
            alert('輸入金額不可小於' + ratioM + '元')
            $('#HGPoint').val(ratioM)
            return false
          }
          if (getVal > maxHGPrice) {
            alert('輸入金額不可大於' + maxHGPrice + '元')
            $('#HGPoint').val(maxHGPrice)
            return false
          }
          if (getVal >= 0) {
            $('.settle_accounts_area .pointerWord b').html(
              getVal * (ratioP / ratioM)
            )
          }
          if (getVal % ratioM != 0) {
            alert(
              '限定' +
                ratioP +
                '點抵' +
                ratioM +
                '元，輸入金額必須為' +
                ratioM +
                '元的倍數，如' +
                ratioM +
                ',' +
                ratioM * 2 +
                ',' +
                ratioM * 3 +
                '元'
            )
            $('#HGPoint').val('')
            return false
          }

          $('.offsetCtrl_happyGoPoint .right').val(getVal)
          $('#calcHGPoint')
            .attr('calc', getVal)
            .text('-$' + getVal)
          calcSum()
          $('.feecdialog_area').remove()
        },
        isCenter: false,
        width: dialogWidth,
        height: dialogHeight,
        infoBody: $('#temp_popup_HGPoint').html(),
        isAnimate: false,
        onReady: function () {
          $('.yesBtn').hide()

          //移除畫面resize問題(畫面無限延伸)此this為options物件
          //					$(window).off("resize", this.windowEvent_fn)
          setTimeout(function () {
            happyGoPoint_fn(function () {
              //呈現最大金額
              $('#maxHGPrice').html(mGH.userHGPrice)

              //取出之前ui操作的結果
              var getVal = $('.offsetCtrl_happyGoPoint .right').val()
              $('#HGPoint').val(getVal)
              $('#calcHGPoint')
                .attr('calc', getVal)
                .text('-$' + getVal)
              calcSum()

              $('#HGPoint').blur(function () {
                var getVal = Math.floor($(this).val())
                var maxHGPrice = $('#maxHGPrice').text()
                if (getVal > maxHGPrice) getVal = maxHGPrice
                if (getVal < 0) getVal = 0
                $('#HGPoint').val(getVal)
              })

              $('.yesBtn').show()
            })
          }, 500)
        },
      })
      $('#temp_popup_HGPoint').remove()
    })
  }
  //事件:點擊使用快樂購卡點數折抵的輸入欄位
  $('.offsetCtrl_happyGoPoint .right').click(function () {
    $('.offsetCtrl_happyGoPoint .right').blur()
    $('#offset_happyGoPoint').prop('checked', true)
    HGPoint_dlalog()
    $('#calcHGPoint').parent().show()
  })
  //事件:點擊使用快樂購卡點數折抵的radiou btn
  $('#offset_happyGoPoint').change(function () {
    if ($(this).prop('checked')) {
      $('#calcHGPoint').parent().show()
      HGPoint_dlalog()
    } else {
      $('#calcHGPoint').parent().hide()
      $('.offsetCtrl_happyGoPoint .right').val('')
      $('#calcHGPoint')
        .attr('calc', 0)
        .text('-$' + 0)
      $('.settle_accounts_area .pointerWord b').html(0)
      calcSum()
    }
  })

  //定義:購物金折抵的dialog方法
  var coupon_dlalog = function () {
    //載入jsp頁後使用dialog套件
    $('body').append(
      "<div id='temp_popup_couponList' style='display:none;'></div>"
    )
    $('#temp_popup_couponList').load('popupCouponlist', {}, function () {
      $(this).feecdialog({
        titleTxt: '請選擇折價券',
        titleIshide: false,
        closeBtnIshide: false,
        isBgClose: false,
        yesBtnIsShow: false,
        noBtnIsShow: false,
        isCenter: false,
        width: '70%',
        height: '85%',
        infoBody: $('#temp_popup_couponList').html(),
        isAnimate: false,
        onReady: function () {
          //console.log("readed")
          //購物金radio btn事件註冊寫在這邊
          $('.popup_couponlist').on(
            'change',
            "input[type='radio']",
            function () {
              var couponId = $(this).val(),
                orderId = $(this).prevAll("input[name='orderId']").val(),
                money = $(this).prevAll("input[name='couponMoney']").val()
              if (couponId != '') {
                $('#selCouponList').val(orderId + ':' + couponId)
                $('.offsetCtrl_coupon .right').val(money)
                $('#calcCoupon')
                  .attr('calc', money)
                  .text('-$' + money)
                calcSum()
                $('.feecdialog_area').remove()
              } else {
                $('#selCouponList').val('')
                $('.offsetCtrl_coupon .right').val('')
                $('#calcCoupon')
                  .attr('calc', 0)
                  .text('-$' + 0)
                calcSum()
                $('.feecdialog_area').remove()
              }
            }
          )
        },
      })
      $('#temp_popup_couponList').remove()
    })
  }

  $('#pay_types .evt-open-popup').on('click', function (e) {
    if ($('.oneArea-cont .text-blue').size() == 1) {
      if (cartTypeId == 2) {
        $('.radio.PAYTYPE_STOR_1').trigger('click')
      } else {
        $('.radio.PAYTYPE_CARD_1').trigger('click')
      }
    }
    popAction(e, $(this))
  })

  //清空新增收貨人區塊中的所有input值及所有錯誤訊息
  function clearAllReceiverInput(){
    $('.receiver-showDetail').find('.input_wrapper input').val('');
    $('.change-receiver-box').find('.input_wrapper').removeClass('error');
    $('#consigneeDefaultCheckbox').prop('checked', false)
    $('#consigneeCity,#consigneeRegion').val('');
    if($('.saveReceiver').find('.icon-switch').hasClass('in')){
        $('.saveReceiver').find('.icon-switch').removeClass('in')
    }
  }
  
  //收貨人點選變更區塊
  $('.consigneeContent_area .evt-open-popup').on('click', function (e) {
    popAction(e, $(this))
    $('.receiver-items').find('.icon-radio.in').removeClass('in')
    $('.receiver-showDetail.in').removeClass('in')
    $('#receiver-icon-value').val(0)
  })

  $('#receiver-icon-value').change(function() {
    clearAllReceiverInput();
    let parent = $(this).closest('.popup-box');
    parent.find('.icon-radio').each(function(index){
      $('.receiver-showDetail').removeClass('in')
    })
    parent.find('.receiver-showDetail').eq($(this).val()-1).addClass('in') //將對應的信息框展開
    if($(this).val()==4){ //若為從收貨通訊錄選擇則跳出選擇dialog
      if (mGH.isDialog) {
        return false
      }
      mGH.isDialog = true
      var getvalue = $(this).attr('value')
      //載入jsp頁後使用dialog套件
      $('body').append(
        "<div id='temp_popup_oftenPeopleList' style='display:none;'></div>"
      )
      //$("#temp_popup_oftenPeopleList").load("popup_oftenpeoplelist.jsp", {}, function(){ //local端測試用
      $('#temp_popup_oftenPeopleList').load(
          'popupOftenpeoplelist',
          {},
        function () {
          mGH.isDialog = false
          $(this).feecdialog({
            titleTxt: '常用收貨人',
            titleIshide: false,
            closeBtnIshide: false,
            isBgClose: false,
            yesBtnIsShow: false,
            noBtnIsShow: false,
            isCenter: false,
            width: '70%',
            height: '85%',
            infoBody: $('#temp_popup_oftenPeopleList').html(),
            isAnimate: false,
            onReady: function () {
              //收貨人
              if (getvalue == '4') {
                $('.popup_oftenpeoplelist').attr('returnForm', 'forConsignee')
              }
              //發票收件人
              if (getvalue == 'forInvoice') {
                $('.popup_oftenpeoplelist').attr('returnForm', 'forInvoice')
              }
            },
          })
          $('#temp_popup_oftenPeopleList').remove()
        }
      )
    }
  });

  //若radio為disable顯示沒有收貨人資料區塊
  $('.change-receiver-box').find('.icon-radio').each(function(index){
    if($(this).hasClass('disable')){
      // $('.receiver-showDetail').eq(index).addClass('in') 
      $('.receiver-noDetail').eq(index).addClass('in')
    }
  })

  //點購物金區塊(含radio button或輸入欄位)
  $('.offsetCtrl_coupon').click(function (event) {
    $('.offsetCtrl_coupon .right').blur()
    if (!$('#offset_coupon').prop('checked')) {
      $('#offset_coupon').prop('checked', true)
    }

    //清除優惠折扣碼選取的狀態(折扣碼及購物金兩者二擇一)
    $('.offsetCtrl_discountCode .left .note:first').text(
      '訂單成立後使用的折扣碼將無法歸還'
    )
    $('.offsetCtrl_discountCode .left .alert:first').hide()
    $('.offsetCtrl_discountCode .right').val('')

    //畫面下方價格總計區塊顯示"購物金/折扣碼折抵"項目且金額歸零
    $('#calcCoupon')
      .attr('calc', 0)
      .text('-$' + 0)
    $('#calcCoupon').parent().show()

    //重新計算"價格總計"
    calcSum()

    //開啟購物金小視窗
    coupon_dlalog()

    //避免子元素的click事件bubble到父元素(.offsetCtrl_coupon)
    event.stopPropagation()
    return false
  })

  //定義:折扣碼折抵的dialog方法
  var discountcode_dlalog = function () {
    //		//載入jsp頁後使用dialog套件
    $('body').append(
      "<div id='temp_popup_discountCode' style='display:none;'></div>"
    )

    //於第一次開啟時固定dialog大小（修正畫面無限拉長問題）
    var windowW = $(window).width(),
      windowH = $(window).height()
    var dialogHeight = windowH * 0.6 //60%
    var dialogWidth = windowW * 0.7 //70%

    $('#temp_popup_discountCode').load('popupDiscountcode', {}, function () {
      $(this).feecdialog({
        titleTxt: '使用折扣碼',
        titleIshide: false,
        closeBtnIshide: false,
        isBgClose: false,
        yesBtnWord: '驗證',
        noBtnWord: '刪除',
        yesBtnIsShow: true,
        noBtnIsShow: true,
        yesFn: function () {},
        noFn: function () {
          $('.offsetCtrl_discountCode .left .note:first').text(
            '訂單成立後使用的折扣碼將無法歸還'
          )
          $('.offsetCtrl_discountCode .right').val('')

          $('#calcCoupon')
            .attr('calc', 0)
            .text('-$' + 0)
          calcSum()
        },
        isCenter: false,
        width: dialogWidth,
        height: dialogHeight,
        infoBody: $('#temp_popup_discountCode').html(),
        isAnimate: false,
        onReady: function () {
          var alert_discountCode = $('.popup_discountcode .alert')
          var note_discountCode = $('.popup_discountcode .note')
          var input_discountCode = $('.popup_discountcode #discountcode')
          var input_yesBtn = $('.feecdialog_area .btnArea .yesBtn')

          input_discountCode.val(
            $('.offsetCtrl_discountCode input[name=discountCode]').val()
          )
          alert_discountCode.hide()

          //移除畫面resize問題(畫面無限延伸)此this為options物件
          //					$(window).off("resize", this.windowEvent_fn)
          //input_discountCode.focus()

          var commClickFn = function (discountCode) {
            var discountCodeCheckOk = false
            var resultObj
            if (discountCode && discountCode.length <= 10) {
              $.ajax({
                url: mGH.apiService + 'checkDiscountcode',
                data: JSON.stringify({
                  discountcode: discountCode,
                  pids: productIds.split(','),
                  specids: specIds.split(','),
                  cartType: cartTypeId,
                }),
                cache: false,
                async: false,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                type: 'POST',
                success: function (jsonStr) {
                  resultObj = jsonStr.payload.result
                  if (resultObj.availableFlag) {
                    //折扣碼正確
                    discountCodeCheckOk = true

                    note_discountCode.text(resultObj.msg)
                    alert_discountCode.text('')
                  } else {
                    //折扣碼錯誤
                    discountCodeCheckOk = false

                    alert_discountCode.text(resultObj.msg)
                    alert_discountCode.show().css('display', 'inline-block')

                    //alert(resultObj.msg)
                  }

                  calcSum()
                },
                error: function (jqXHR, textStatus, errorMessage) {
                  discountCodeCheckOk = false

                  alert_discountCode.text('目前無法檢查折扣碼!!')
                  alert_discountCode.show().css('display', 'inline-block')
                },
              })
            } else {
              discountCodeCheckOk = false

              alert_discountCode.text('優惠折扣碼長度不正確')
              alert_discountCode.show().css('display', 'inline-block')
            }

            return {
              discountCodeCheckOk: discountCodeCheckOk,
              resultObj: resultObj,
            }
          }

          input_discountCode.change(function () {
            alert_discountCode.hide()
          })

          input_yesBtn.off('click')
          input_yesBtn.on('click', function (event) {
            var discountCode = input_discountCode.val()
            var result = commClickFn(discountCode)
            if (result.discountCodeCheckOk) {
              $('.offsetCtrl_discountCode .left .note:first').text(
                result.resultObj.msg
              )
              $('.offsetCtrl_discountCode .right').val(discountCode)
              $('#calcCoupon')
                .attr('calc', result.resultObj.discount)
                .text('-$' + result.resultObj.discount)
              calcSum()
              $('.feecdialog_area').remove()
            }
          })
        },
      })
      $('#temp_popup_discountCode').remove()
    })
  }

  $('.offsetCtrl_discountCode .left .alert:first').hide()

  //事件:點擊使用使用優惠折扣碼折抵的輸入欄位
  $('.offsetCtrl_discountCode').click(function (event) {
    $('.offsetCtrl_discountCode .right').blur()
    if (!$('#offset_discountCode').prop('checked')) {
      $('#offset_discountCode').prop('checked', true)
    }

    //清除購物金選取的狀態(折扣碼及購物金兩者二擇一)
    $('#selCouponList').val('')
    $('.offsetCtrl_coupon .right').val('')

    //畫面下方價格總計區塊顯示"購物金/折扣碼折抵"項目且金額歸零
    $('#calcCoupon')
      .attr('calc', 0)
      .text('-$' + 0)
    $('#calcCoupon').parent().show()

    //重新計算"價格總計"
    calcSum()

    //開啟折扣碼小視窗
    discountcode_dlalog()

    //避免子元素的click事件bubble到父元素(.offsetCtrl_discountCode)
    event.stopPropagation()
    return false
  })

  //事件:改變使用遠傳幣折抵的輸入欄位
  const maxSettleVal = $('#settleAccounts').val()
  const $offsetCtrlFCoin = $('.offsetCtrl_FCoin')
  const $offsetFCoin = $('#offset_FCoin')
  const $calcFCoin = $('#calcFCoin')

  $offsetCtrlFCoin.on('keyup', '.right', function () {
    $offsetFCoin.prop('checked', true)
    var getVal = Math.floor($(this).val())
    var maxVal = mGH.FCoin
    if (getVal > maxVal) {
      getVal = maxVal
    }

    $(this).val(getVal)

    if (getVal <= 0) {
      $(this).val('')
      getVal = 0
      $offsetFCoin.prop('checked', false)
    }

    if (isNaN(getVal)) {
      $(this).val('')
      getVal = 0
      $offsetFCoin.prop('checked', false)
    }

    var resultWelfarePointVal = $(
      '.offsetCtrl_welfarePoint input[name=benefitAmount]'
    ).val()
    var tmpVal = 0
    if (resultWelfarePointVal > 0) {
      tmpVal = maxSettleVal - resultWelfarePointVal - getVal
      if (tmpVal - getVal < 0) {
        getVal = maxSettleVal - resultWelfarePointVal
        $(this).val(getVal)
      }
    }

    if (maxSettleVal - getVal < 0) {
      getVal = maxSettleVal
      $(this).val(getVal)
    }
    $calcFCoin.attr('calc', getVal).text('-$' + getVal)
    calcSum()
    $calcFCoin.parent().show()
  })

  //事件:點擊使用遠傳幣折抵的radiou btn
  $offsetFCoin.change(function () {
    if (!$(this).prop('checked')) {
      $calcFCoin.parent().hide()
      $offsetCtrlFCoin.find('.right').val('')
      $calcFCoin.attr('calc', 0).text('-$' + 0)
      calcSum()
    } else {
      $calcFCoin.parent().show()
      $offsetCtrlFCoin.find('.right').focus()
    }
  })

  //判斷是否為點數優惠期間
  if (isHappyGoPromo) {
    //是優惠期間
    $("input[name='checkOffset']").prop('checked', false)
    $('#offsetCtrl_checkArea').show()
    $(
      '.offsetCtrl_happyGoPoint, .offsetCtrl_coupon, .offsetCtrl_discountCode'
    ).hide()
    $('.offsetCtrl_alert').hide()
    //訪客購買時移除優惠期間區塊只show出折扣碼
    if ($("input[name='activatedStatus']").val() == 4) {
      $('#offsetCtrl_checkArea').remove()
      $('.offsetCtrl_alert').remove()
      $('.offsetCtrl_coupon').remove()
      $('.offsetCtrl_happyGoPoint').remove()
      $('.offsetCtrl_discountCode').show()
    } else {
      $('#offsetCtrl_checkArea').show()
    }
    //事件:優惠期間選擇額外的優惠折抵
    $("input[name='checkOffset']").change(function () {
      $('.settle_accounts_area .pointerWord b').html(0) //先行清空

      $(
        '.offsetCtrl_happyGoPoint, .offsetCtrl_coupon, .offsetCtrl_discountCode'
      ).hide()
      $(
        '.offsetCtrl_happyGoPoint, .offsetCtrl_coupon, .offsetCtrl_discountCode'
      )
        .find("input[type='checkbox']")
        .prop('checked', false)
      $(
        '.offsetCtrl_happyGoPoint, .offsetCtrl_coupon, .offsetCtrl_discountCode'
      )
        .find("input[type='radio']")
        .prop('checked', false)
      $(
        '.offsetCtrl_happyGoPoint, .offsetCtrl_coupon, .offsetCtrl_discountCode'
      )
        .find('.right')
        .val(getVal)
      $('#calcHGPoint, #calcCoupon, #calcDiscountCode')
        .attr('calc', 0)
        .text('-$' + 0)
      var getVal = $(this).val()
      if (getVal == '1') {
        $('.offsetCtrl_happyGoPoint').show()
        $('#calcCoupon').parent('.tr').hide()
        $('#calcDiscountCode').parent('.tr').hide()
        $('#selCouponList').val('')
        $('.offsetCtrl_alert').hide()
      } else {
        $('.offsetCtrl_coupon, .offsetCtrl_discountCode').show()
        $('#calcHGPoint').parent('.tr').hide()
        $('.offsetCtrl_alert').show()
      }
      calcSum()
    })
  } else {
    //不是優惠期間
    $('#offsetCtrl_checkArea').remove()
    $(
      '.offsetCtrl_happyGoPoint, .offsetCtrl_coupon, .offsetCtrl_discountCode'
    ).show()
  }
  //判斷是否有開通HappyGo點數
  if (!isHappyMember) {
    //沒開通
    $('.offsetCtrl_happyGoPoint').remove()
    $('#calcHGPoint').parent('.tr').hide()
  } else {
    //有開通
    var rewardpointType = $('#rewardpointType').val()

    //判斷是否使用 點加金
    if (rewardpointType == 'REWARDPOINT') {
      $('.offsetCtrl_happyGoPoint').remove()
      $('#calcHGPoint').parent('.tr').hide()

      //額外改變點數優惠期間的ui介面
      $('#checkOffset2').prop('checked', true)
      $('.offsetCtrl_coupon, .offsetCtrl_discountCode').show()
      $('#offsetCtrl_checkArea .offsetCtrl_area:first').remove()
      //console.log('點加金')
    }
    //判斷是否使用 純點
    if (rewardpointType == 'EXCHANGEPOINT') {
      $('.offset_area').remove()
      $(
        '#calcCoupon, #calcDiscountCode, #calcWelfarePoint, #calcHGPoint, #calcFCoin'
      )
        .parent('.tr')
        .hide()

      //額外改變點數優惠期間的ui介面
      $('#checkOffset2').prop('checked', true)
      $('.offsetCtrl_coupon, .offsetCtrl_discountCode').show()
      $('#offsetCtrl_checkArea .offsetCtrl_area:first').remove()
      //console.log('純點')
    }
  }

  //若資料不完全則 隱藏fastCheckout
  if ($('.firstOrderpeople_area').size() > 0) {
    if ($('.FastCtrl_area').size() > 0) {
      $('.FastCtrl_area').hide() // 先隱藏
    }
  }

  var isTaiPowerMember = $('input[name="isTaiPowerMember"]').val() == 'true'
  if (isTaiPowerMember) {
    $('#atmBtn').prop('checked', true)
    $('.PAYTYPE_MATM_1.paytype').addClass('active')
    $('#payTypeName').val('PAYTYPE_MATM_1')
    $('.invoiceContent_area').parent('.oneArea').hide()
  }

  const secretCode = {
      name(name){
        return name.replace(/^(.{1}).(.*)$/ , '$1*$2')
      },
      phone(phone){
        return phone.replace(/^(\d{4})\d{3}(\d{3})$/ , '$1***$2')
      },
      email(email){
        let substr = email.substring(1,email.indexOf('@'));
        return email.replace(substr,Array(substr.length+1).join("*"))
      },
     address(address){
         let substr;
         if(address.length < 5){
            substr = address.match(/[0-9a-zA-Z\u4E00-\u9FA5]+$/)
         }else{
            substr = address.match(/[0-9a-zA-Z\u4E00-\u9FA5].{4}/) 
         }
//       alert(substr)
        return address.replace(substr[0],Array(substr[0].length+1).join('*'))
     }
  }

  // 取得各receiver-showDetail中的資料
  function getReceiverValue(){
    let choseNumber = Number($('#receiver-icon-value').val());
    let detail = $('.receiver-items').eq(choseNumber-1).find('.receiver-showDetail p');  //找出對應的detail內容塊(非新增收貨人區塊)
    let increaseReceiver = $('.receiver-items'); //新增收貨人區塊
    let obj = {name:'' , email:'' , address:'' }
    if(choseNumber === 1 || choseNumber === 2 || choseNumber === 4){ //非新增收貨人
      obj.name = detail.eq(0).html();
      obj.email = detail.eq(1).html();
      obj.address = detail.eq(2).html();
      
      if( choseNumber === 1 ){ //同訂購人
        $('.consigneeName').val(memberName)
        $('.consigneeMobile').val(memberPhone)
        $('.consigneeTel').val(memberTel)
        $('.consigneeEmail').val(memberEmail)
        $('.consigneeCity').val(memberCityId)
        $('.consigneeRegion').val(memberCountyId)
        $('.consigneeRoad').val(memberRoad)
        $('.consigneeAddOftenPeople').val(false)
      }
      if( choseNumber === 2 ){//同預設收貨人
        $('.consigneeName').val(defaultConsigneeName)
        $('.consigneeMobile').val(defaultConsigneeMobile)
        $('.consigneeTel').val(defaultConsigneeTel)
        $('.consigneeEmail').val(defaultConsigneeEmail)
        $('.consigneeCity').val(defaultConsigneeCity)
        $('.consigneeRegion').val(defaultConsigneeCounty)
        $('.consigneeRoad').val(defaultConsigneePartialAddress)
        $('.consigneeAddOftenPeople').val(false)
      }
     if( choseNumber === 4 ){//從通訊錄選擇收貨人
        $('.consigneeName').val(thatName)
        $('.consigneeMobile').val(thatMobile)
        $('.consigneeTel').val(thatTel)
        $('.consigneeEmail').val(thatEmail)
        $('.consigneeCity').val(thatCity)
        $('.consigneeRegion').val(thatRegion)
        $('.consigneeRoad').val(thatRoad)
        $('.consigneeAddOftenPeople').val(false)
      }
      
    }else if(choseNumber === 3 ){   //新增收貨人
      obj.name =  secretCode.name(increaseReceiver.find(".consigneeName").val()) + ' ' + secretCode.phone(increaseReceiver.find('.consigneeMobile').val());
      obj.email = secretCode.email(increaseReceiver.find(".consigneeEmail").val())
      obj.address = increaseReceiver.find("#consigneeCity").find(":selected").text() + increaseReceiver.find('#consigneeRegion').find(":selected").text() + secretCode.address(increaseReceiver.find('.consigneeRoad').val());
      
        $('.consigneeName').val(increaseReceiver.find(".consigneeName").val())
        $('.consigneeMobile').val(increaseReceiver.find('.consigneeMobile').val())
        $('.consigneeTel').val(increaseReceiver.find('.consigneeTel').val())
        $('.consigneeEmail').val(increaseReceiver.find(".consigneeEmail").val())
        $('.consigneeCity').val(increaseReceiver.find("#consigneeCity").find(":selected").val())
        $('.consigneeRegion').val(increaseReceiver.find('#consigneeRegion').find(":selected").val())
        $('.consigneeRoad').val(increaseReceiver.find('.consigneeRoad').val())
        
        if($('.icon-switch').hasClass('in')){
             $('.consigneeAddOftenPeople').val(true)
        }else{
             $('.consigneeAddOftenPeople').val(false)
        }
 
    }
    return obj;
  }

    //選擇收貨人 submit
  $(".receiver-check-btn").click(function(){
    //防呆:收貨人 start

    if($('#receiver-icon-value').val()==0 ){
        alert('請選擇收貨人')
        return
    }
    if($('#receiver-icon-value').val()==4 && '' == thatName){
        alert('未正確選擇收貨人，請重新確認收貨人資料')
        return
    }   
      //清除所有錯誤訊息及提示框
      $('.change-receiver-box').find('.input_wrapper').removeClass('error');
      // $('. *').removeClass('error')
      // $('.error_msg').text('')

    var consigneeContentError = false

    if (memberRoad == '' && citysuperAddress == 'citysuper店取商品') {
      $('#consigneeDefaultCheckbox').click()
    }

    //$(".errorView").removeClass("errorView")
    //      if (!$("#consigneeDefaultCheckbox")
    //        .prop("checked")) {
    var that = $('.receiver-showDetail');
    //姓名
    var name = that.find('.consigneeName').val()
    var ShippingType = $('input[name=cartTypeId]').val()
    if (ShippingType != 2 && checkName(name) != '') {
      //非超取走原本的檢核，超商檢核透過API
      //errorMsg += "\n‧收貨人-姓名錯誤";
      $('.consigneeName').parents('.input_wrapper').addClass('error')
      $('#consigneeName_error').text('收貨人-姓名錯誤' + checkName(name))
      consigneeContentError = true
    }
    // 手機必填,市話選填
    var phone_num = $.trim(that.find('.consigneeMobile').val())
    var tel_num = $.trim(that.find('.consigneeTel').val())
      //手機
      if (checkMoblie(phone_num, false) != '') {
        //errorMsg += "\n‧收貨人-手機號碼錯誤" + checkMoblie(phone_num)
        $('.consigneeMobile').parents('.input_wrapper').addClass('error')
        $('#consigneeMobile_error').text(
          '收貨人-手機號碼錯誤' + checkMoblie(phone_num)
        )
        consigneeContentError = true
      }
      //市話
      if (checkTel(tel_num) != '' && tel_num != '') {
        //errorMsg += "\n‧收貨人-市話號碼錯誤" + checkTel(tel_num)
        $('.consigneeTel').parents('.input_wrapper').addClass('error')
        $('#consigneeTel_error').text('收貨人-市話號碼錯誤' + checkTel(tel_num))
        consigneeContentError = true
      }

    //email
    var email_addr = that.find('.consigneeEmail').val()
    if ('2' != cartTypeId && checkEmail(email_addr) != '') {
      // 超取的收貨人不檢查email

      //errorMsg += "\n‧收貨人-email錯誤" + checkEmail(email_addr)
      $('.consigneeEmail').parents('.input_wrapper').addClass('error')
      $('#consigneeEmail_error').text(
        '收貨人-email錯誤' + checkEmail(email_addr)
      )
      consigneeContentError = true
    }
    //縣市
    if (
      ('2' != cartTypeId && that.find('#consigneeCity').val() == '') ||
      that.find('#consigneeCity').val() == '請選擇縣市'
    ) {
      // 超取不檢查

      //errorMsg += "\n‧收貨人-縣市錯誤";
      $('.consigneeCity').parents('.input_wrapper').addClass('error')
      $('#consigneeAddress_error').text('收貨人-縣市錯誤,本欄位不可為空')
      consigneeContentError = true
    }
    //區域
    if (
      '2' != cartTypeId &&
      (that.find('#consigneeRegion').val() == '' ||
        that.find('#consigneeRegion').val() == null)
    ) {
      // 超取不檢查

      //errorMsg += "\n‧收貨人-區域錯誤";
      $('.consigneeRegion').parents('.input_wrapper').addClass('error')
      $('#consigneeAddress_error').text('收貨人-區域錯誤,本欄位不可為空')
      consigneeContentError = true
    }
    //地址

    var consigneeRoad = that.find('.consigneeRoad').val()
    if (
      '2' != cartTypeId &&
      checkRoad(consigneeRoad) != '' &&
      citysuperAddress != 'citysuper店取商品'
    ) {
      // 超取不檢查
      //errorMsg += "\n‧收貨人-地址錯誤";
      $('.consigneeRoad').parents('.input_wrapper').addClass('error')
      $('#consigneeAddress_error').text(
        '收貨人-地址錯誤 ' + checkRoad(consigneeRoad)
      )
      consigneeContentError = true
    }
    //防呆:收貨人 end

    
    let pass = true ;
    
    if($('#receiver-icon-value').val()==='3'){  //若是選新增收貨人radio才需要查看欄位有無錯誤
      $('.change-receiver-box').find('.input_wrapper').each(function(){
          if($(this).hasClass('error')){
            pass = false;
          }
      });
    }

    if(pass){
      let obj = getReceiverValue();
      $(".consigneeContent_area p").eq(0).html(obj.name)
      $(".consigneeContent_area p").eq(1).html(obj.email)
      $(".consigneeContent_area p").eq(2).html(obj.address)
      $('.form-disable').trigger('click') 
    }
  })

 

  //最後送出
  $('.sendBtn').click(function () {

    if ($('#mobile_error').attr('value') >= 3) {
      needCheckCaptcha()
    }

    //發票防呆＆送出發票方式
    var isInvoiceCheck = updateMemberInvoice();
    console.log("%%%%%%%"+ isInvoiceCheck);
    //清除所有錯誤訊息及提示框
    $('.firstOrderpeople_area *').removeClass('error')
    $('.error_msg').text('')
  
    var isAgreement = $('#agreementCheckbox').prop('checked')
    if (!isAgreement) {
      alert('請先勾選同意條款')
      return false
    }

    if ('4' == cartTypeId) {
      //金石堂
      var storename = $('.td.forstorename').text() //店名
      var storeaddress = $('.td.forstoreaddress').text() //地址
      if ('' == storename && '' == storeaddress) {
        alert('請選擇取貨付款門市')
        $('html, body').animate(
          {
            //滑動到特定位置
            scrollTop:
              parseInt($('#payTypeName').closest('.oneArea').offset().top) -
              107,
          },
          '0'
        )
        return false
      }
    }

    if (    //訪客不需要檢查此checkbox
      member_active_status != undefined &&
      member_active_status != '1' &&
      member_active_status != '3'
    ) {
      var isAgreement = $('#agreementMemCheckbox').prop('checked')
      if (!isAgreement) {
        if(member_active_status == 4){  //訪客錯誤訊息
          alert('請勾選同意購物約定條款及隱私權條款')
          return false
        } //一般會員錯誤訊息
        alert('先勾選成為網站會員的約定條款')
        return false
      }
    }
    var finalPrice = calcSum()
    if (finalPrice < 0) {
      alert('提醒:本次消費金額不可為小於0,請調整您的折價券與點數折抵方式')
      return false
    }

    
    //防呆:付款方式 start
    var payType = $('#payTypeName').val() //判斷結帳方式
    //超商取貨付款
    /*if (payType == "PAYTYPE_WATM_1") {
        if (
          $("input[name='srvno']")
          .val() == "" ||
          $("input[name='storeaddress']")
          .val() == "" ||
          $("input[name='storename']")
          .val() == ""
        ) {
          alert("提醒:結帳方式超商取貨付款:\n您尚未選擇超商")
          return false;
        }
      }*/

    // 如果運送方式為超商(檢查資料完整性後在送出資料)
    if ('2' == cartTypeId) {
      if (
        '' != $('#storeId').val() &&
        '' != $('#storeName').val() &&
        '' != $('#storeAddress').val()
      ) {
        $("input[name='srvno']").val($('#storeId').val())
        $("input[name='storename']").val($('#storeName').val())
        $("input[name='storeaddress']").val($('#storeAddress').val())
        $("input[name='storeType']").val($('#storeType').val())
      } else {
        alert('無法選擇此門市取貨，請重新選擇')
        return false
      }
      // 超取 TODO 超取要從新的Pop畫面把收貨人資料填入Checkout
      //    	  if (){
      //    	  }
    }

    //信用卡全額,信用卡3期,信用卡6期,信用卡12期,信用卡18期,信用卡24期,信用卡30期,紅利折抵
    var cardContentErrorMsg = '信用卡錯誤:'

    var cardContentError = false

    $('.error').removeClass('error')
    //先判斷是否全額折抵
    if (finalPrice != 0) {
      if (
        payType == 'PAYTYPE_CARD_1' ||
        payType == 'PAYTYPE_CARD_3' ||
        payType == 'PAYTYPE_CARD_6' ||
        payType == 'PAYTYPE_CARD_12' ||
        payType == 'PAYTYPE_CARD_18' ||
        payType == 'PAYTYPE_CARD_24' ||
        payType == 'PAYTYPE_CARD_30' ||
        payType == 'PAYTYPE_CARDC_1'
      ) {
        //區分是否首購
        //if(isfirstOrderpeople){}

        //區分UI是否有變更信用卡資料
        if(member_active_status != '4'){  //一般會員驗證
          if ($('.creditCardList .credit-card-items').size() == 0) {
            cardContentErrorMsg += '\n‧尚未選擇付款方式'
            cardContentError = true
          } else if (
            $('.fastCard3Num').val() == '' ||
            $('.fastCard3Num').val() == undefined
          ) {
            cardContentErrorMsg += '\n‧信用卡末三碼尚未填寫'
            $('.fastCard3Num').parent().addClass('error')
            cardContentError = true
          }
        }else{  //訪客驗證
          var cvp = checkVisitorPayMethod();  //訪客走自己的檢查方法
          if(!cvp){
            cardContentErrorMsg += '格式錯誤'
            cardContentError = true
          }
        }
      }
    }
    //防呆:付款方式 end

    //防呆:收貨人 start
    var consigneeContentErrorMsg = '收貨人資料錯誤'

    var consigneeContentError = false

    if (memberRoad == '' && citysuperAddress == 'citysuper店取商品') {
      $('#consigneeDefaultCheckbox').click()
    }

    //$(".errorView").removeClass("errorView")
    //      if (!$("#consigneeDefaultCheckbox")
    //        .prop("checked")) {
    var that = $('#consigneeDifferent_Content')
    //姓名
    var name = that.find('.consigneeName').val()
    var ShippingType = $('input[name=cartTypeId]').val()
    if (ShippingType != 2 && checkName(name) != '') {
      //非超取、訪客走原本的檢核，超商檢核透過API
      //errorMsg += "\n‧收貨人-姓名錯誤";
      $('.consigneeName').parents('.input_wrapper').addClass('error')
      $('#consigneeName_error').text(checkName(name))
      consigneeContentError = true
    }
    // 手機必填,市話選填
    var phone_num = $.trim(that.find('.consigneeMobile').val())
    var tel_num = $.trim(that.find('.consigneeTel').val())
      //手機
      if (checkMoblie(phone_num, false) != '') {
        //errorMsg += "\n‧收貨人-手機號碼錯誤" + checkMoblie(phone_num)
        $('.consigneeMobile').parents('.input_wrapper').addClass('error')
        $('#consigneeMobile_error').text(
          checkMoblie(phone_num)
        )
        consigneeContentError = true
      }
      //市話
      if (checkTel(tel_num) != '' && tel_num != '' ) {
        //errorMsg += "\n‧收貨人-市話號碼錯誤" + checkTel(tel_num)
        $('.consigneeTel').parents('.input_wrapper').addClass('error')
        $('#consigneeTel_error').text('收貨人-市話號碼錯誤' + checkTel(tel_num))
        consigneeContentError = true
      }

    //email
    if(!isVisitor){  //訪客無email輸入區塊所以不需檢核
      var email_addr = that.find('.consigneeEmail').val()
      if ('2' != cartTypeId && checkEmail(email_addr) != '') {
        // 超取的收貨人不檢查email
  
        //errorMsg += "\n‧收貨人-email錯誤" + checkEmail(email_addr)
        $('.consigneeEmail').parents('.input_wrapper').addClass('error')
        $('#consigneeEmail_error').text(
          '收貨人-email錯誤' + checkEmail(email_addr)
        )
        consigneeContentError = true
      }
    }
    //縣市
    var consigneeRoad = that.find('.consigneeRoad').val()
    if (
      ('2' != cartTypeId && that.find('#consigneeCity').val() == '') ||
      that.find('.consigneeCity').val() == '請選擇縣市'
    ) {
      // 超取不檢查

      //errorMsg += "\n‧收貨人-縣市錯誤";
      $('.consigneeCity').parents('.input_wrapper').addClass('error')
      $('#consigneeAddress_error').text('請選擇縣市')
      consigneeContentError = true
    }
    //區域
    else if (
      '2' != cartTypeId && 
      (that.find('.consigneeRegion').val() == '' ||
        that.find('.consigneeRegion').val() == null)
    ) {
      // 超取不檢查

      //errorMsg += "\n‧收貨人-區域錯誤";
      $('.consigneeRegion').parents('.input_wrapper').addClass('error')
      $('#consigneeAddress_error').text('請選擇區域')
      consigneeContentError = true
    }
    //地址

   
    else if (
      '2' != cartTypeId &&
      checkRoad(consigneeRoad) != '' &&
      citysuperAddress != 'citysuper店取商品'
    ) {
      // 超取不檢查
      //errorMsg += "\n‧收貨人-地址錯誤";
      $('.consigneeRoad').parents('.input_wrapper').addClass('error')
      $('#consigneeAddress_error').text(
        checkRoad(consigneeRoad)
      )
      consigneeContentError = true
    }
    //防呆:收貨人 end

    //防呆:當購買人資訊不完全 或是OPENID, or訪客
    var firstOrderContentErrorMsg = '訂購人資料錯誤'

    var firstOrderContentError = false

    if ($('.firstOrderpeople_area').size() > 0 && !isVisitor) {
      //資料不完整會員
      if ($('.FastCtrl_area').size() > 0) {
        $('.FastCtrl_area').hide() // 先隱藏
      }
      var that = $('.firstOrderpeople_area')
      //姓名
      var first_name = that.find('.firstName').val()
      if (checkName(first_name) != '') {
        //errorMsg += "\n‧訂購人-姓名錯誤" + checkName(first_name)
        $('.firstName').parents('.input_wrapper').addClass('error')
        $('#name_error').text('訂購人-姓名錯誤' + checkName(first_name))
        firstOrderContentError = true
      }
      //縣市
      if (
        that.find('#firstCity').val() == '' ||
        that.find('#firstCity').val() == '請選擇縣市'
      ) {
        //errorMsg += "\n‧訂購人-縣市錯誤";
        $('.firstCity').parents('.input_wrapper').addClass('error')
        $('#memberAddress_error').text('訂購人-縣市錯誤,本欄位不可為空')
        firstOrderContentError = true
      }
      //區域
      if (
        that.find('#firstRegion').val() == '' ||
        that.find('#firstRegion').val() == null
      ) {
        //errorMsg += "\n‧訂購人-區域錯誤";
        $('.firstRegion').parents('.input_wrapper').addClass('error')
        $('#memberAddress_error').text('訂購人-區域錯誤,本欄位不可為空')
        firstOrderContentError = true
      }
      //地址
      var firstRoad = that.find('.firstRoad').val()
      if (
        checkRoad(firstRoad) != '' &&
        citysuperAddress != 'citysuper店取商品'
      ) {
        //errorMsg += "\n‧訂購人-地址錯誤" + checkRoad(firstRoad)
        $('.firstRoad').parents('.input_wrapper').addClass('error')
        $('#memberAddress_error').text(
          '訂購人-地址錯誤 ' + checkRoad(firstRoad)
        )
        firstOrderContentError = true
      }
      //			if(that.find(".firstRoad").val() == ""){
      //				errorMsg += "\n‧訂購人-地址錯誤";
      //				$(".firstRoad").addClass("errorView")
      //				haveErroe = true;
      //			}
      //性別

      var memberSex = that.find('select[name=firstSex]').val()

      if (!memberSex) {
        $('#sex_error').text('訂購人-性別錯誤,本欄位不可為空')
        $('#firstSexCtrl_area').parents('.input_wrapper').addClass('error')
        firstOrderContentError = true
      }
      //生日

      var memberBirthday = $('#memberBirthday').val()
      var firstBirthday = $('#firstBirthday').val()

      if (!memberBirthday) {
        $('#memberBirthday').parents('.input_wrapper').addClass('error')
        firstOrderContentError = true
      }
      if (!firstBirthday) {
        $('#memberBirthday').parents('.input_wrapper').addClass('error')
        firstOrderContentError = true
      }

      // 手機或市話其一填寫即可
      var first_phone_num = that.find('.firstMobile').val()
      var first_tel_num = that.find('.firstTel').val()
      if (first_phone_num == '' && first_tel_num == '') {
        //errorMsg += "\n‧訂購人-手機號碼與市話號碼須擇一填寫";
        $('#mobile_error , #tel_error').text('訂購人-手機號碼未填寫')
        $('.firstMobile , .firstTel')
          .parents('.input_wrapper')
          .addClass('error')
        firstOrderContentError = true
      } else {
        //手機

        if (
          checkMoblie(first_phone_num, false) != '' &&
          first_phone_num != ''
        ) {
          //errorMsg += "\n‧訂購人-手機號碼錯誤" + checkMoblie(first_phone_num)
          $('.firstMobile').parents('.input_wrapper').addClass('error')

          $('#mobile_error').text(
            '訂購人-手機號碼錯誤' + checkMoblie(first_phone_num, true)
          )
          firstOrderContentError = true
        }
        //市話
        if (checkTel(first_tel_num) != '' && first_tel_num != '') {
          //errorMsg += "\n‧訂購人-市話號碼錯誤" + checkTel(first_tel_num)
          $('.firstTel').parents('.input_wrapper').addClass('error')
          $('#tel_error').text('訂購人-市話號碼錯誤' + checkTel(first_tel_num))
          firstOrderContentError = true
        }
      }

      //email
      var first_email_addr = that.find('.firstEmail').val()

      if (checkEmail(first_email_addr, emailErrorMessage) != '') {
        //errorMsg += "\n‧訂購人-email錯誤" + checkEmail(first_email_addr)
        $('.firstEmail').parents('.input_wrapper').addClass('error')

        $('#email_error').text(
          '訂購人-email錯誤' + checkEmail(first_email_addr, emailErrorMessage)
        )
        firstOrderContentError = true
      }
      // 訪客購買訂購人資料檢核
    } else if ($('.firstOrderpeople_area').size() > 0 && isVisitor) {
      //訪客

      var that = $('.firstOrderpeople_area')
      //姓名
      var first_name = that.find('.firstName').val()

      if (checkName(first_name) != '') {
        //errorMsg += "\n‧訂購人-姓名錯誤" + checkName(first_name)
        $('.firstName').parents('.input_wrapper').addClass('error')
        $('#name_error').text(checkName(first_name))
        firstOrderContentError = true
      }

      // 手機或市話其一填寫即可
      var first_phone_num = that.find('.firstMobile').val()
      if (checkMoblie(first_phone_num, false) != '') {
        //errorMsg += "\n‧收貨人-手機號碼錯誤" + checkMoblie(phone_num)
        $('.firstMobile').parents('.input_wrapper').addClass('error')
        $('#mobile_error').text(
          checkMoblie(first_phone_num)
        )
        firstOrderContentError = true
      }
      // if (first_phone_num == '') {
      //   //errorMsg += "\n‧訂購人-手機號碼與市話號碼須擇一填寫";
      //   $('#mobile_error').text('訂購人-手機號碼未填寫')
      //   $('.firstMobile').parents('.input_wrapper').addClass('error')
      //   firstOrderContentError = true
      // } else {
      //   //手機
      //   if (checkMoblie(first_phone_num, true) != '' && first_phone_num != '') {
      //     //errorMsg += "\n‧訂購人-手機號碼錯誤" + checkMoblie(first_phone_num)
      //     $('.firstMobile').parents('.input_wrapper').addClass('error')

      //     $('#mobile_error').text(
      //       '訂購人-手機號碼錯誤' + checkMoblie(first_phone_num, true)
      //     )
      //     firstOrderContentError = true
      //   }
      // }

      //email
      var first_email_addr = that.find('.firstEmail').val()

      if (checkEmail(first_email_addr, emailErrorMessage) != '') {
        //errorMsg += "\n‧訂購人-email錯誤" + checkEmail(first_email_addr)
        $('.firstEmail').parents('.input_wrapper').addClass('error')

        $('#email_error').text(
          checkEmail(first_email_addr, emailErrorMessage)
        )
        firstOrderContentError = true
      }

      // //地址(目前訪客訂購人沒有地址輸入框)
      // var firstRoad = that.find('.firstRoad').val()
      // if (
      //   checkRoad(firstRoad) != '' &&
      //   citysuperAddress != 'citysuper店取商品'
      // ) {
      //   //errorMsg += "\n‧訂購人-地址錯誤" + checkRoad(firstRoad)
      //   $('.firstRoad').parents('.input_wrapper').addClass('error')
      //   $('#memberAddress_error').text(
      //     '訂購人-地址錯誤 ' + checkRoad(firstRoad)
      //   )
      //   firstOrderContentError = true
      // }
    }
    //防呆:首購 end 當購買人資訊不完全 或是OPENID, or訪客

    //填寫欄位區塊錯誤，畫面移置最上方錯誤的區塊位置
    if (cardContentError) {  //付款方式error
      alert(cardContentErrorMsg)
      if(!isVisitor){
        $('html, body').animate(
          {
            scrollTop: parseInt($('#pay_types').offset().top, 10) - 107,
          },
          '0'
        )
      }else{
        const cardInputArea = document.getElementsByClassName('cardInputArea')[0]
        cardInputArea.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      }
      return false
    } else if (firstOrderContentError) { //訂購人error
      alert(firstOrderContentErrorMsg)
      if(!isVisitor){
        $('html, body').animate(
          {
            scrollTop:
              parseInt(
                $('.firstOrderpeople_area').closest('.oneArea').offset().top
              ) - 107,
          },
          '0'
        )
      }else{
        const firstOrderpeople_area = document.getElementsByClassName('firstOrderpeople_area')[0]
        firstOrderpeople_area.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      }
      return false
    } else if (consigneeContentError) { //收貨人error
      alert(consigneeContentErrorMsg)
      if( isVisitor || cartTypeId == 2 ){ 
      // $('html, body').animate(
      //       {
      //         scrollTop:
      //           parseInt(
      //             $('#consigneeDefaultCheckbox').closest('.oneArea').offset().top
      //           ) - 107,
      //       },
      //       '0'
      //     )
      const consigneeContent_area = document.getElementsByClassName('consigneeContent_area')[0]
      consigneeContent_area.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      }
      else{
          $('html, body').animate(
            {
              scrollTop:
                parseInt(
                  $('#consigneeContent_area').top
                ) - 107,
            },
            '0'
          )
      }
          return false
    }else if(!isInvoiceCheck){  // 發票error
      alert('發票資料錯誤')
      const invoiceInfo_area = document.getElementsByClassName('invoiceInfo_area')[0]
      invoiceInfo_area.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }

    //會員資料不完整(手機未填)
    if (member_active_status != undefined && member_active_status != '4') {
      if (
        $('.firstMobile').val() == '' ||
        $('.firstMobile').val() == undefined
      ) {
        if (memberPhone == '' && $('.consigneeMobile').val() == '') {
          alert('訂購人資料不完整，請至[會員/服務設定]修改手機號碼!!')
          $('#consigneeDefaultCheckbox').prop('checked', false)
          $('#consigneeDifferent_Content').show()
          return
        }
      }
    }
    fridayAddPaymentInfo()
    // 資料不完整的會員填完資料後欄位要打開才能送出
    if (member_active_status == '2') {
      $('.firstOrderpeople_area').find('.firstName').attr('disabled', false)
      $('select[name=firstY]').attr('disabled', false)
      $('select[name=firstM]').attr('disabled', false)
      $('select[name=firstD]').attr('disabled', false)
      $('#firstSexFemale').attr('disabled', false)
      $('#firstSexMale').attr('disabled', false)
    }
    if(!isInvoiceCheck){  //發票檢測tag
      return false ;
    }
    $('.sendBtn').attr('disabled', true)
    $('#checkoutForm').attr('action', '/mobileweb/checkout/msgwarrant')
    if($("#memoArea").val()){
            $("#memoArea").parents("div").find("input[name='memo']").val($("#memoArea").val())
    }

    //將進step2時的暫存jession補上，避免中途發生jession發生變異，導致無法結帳
    var testjs = GetUTF8Cookie('JSESSIONID-test')

    if (testjs != 'null') {
      $.cookie('JSESSIONID', testjs, { path: '/mobileweb' })
    }

    //儲存收貨人資料到app (for app轉轉)
    const st = sessionStorage.getItem('turnturn_AI');
    alert(st)
    if(st === 'app'){
      alert('enter')
      f(saveConsigneeToApp)
      // saveConsigneeToApp();
    }
    $('#checkoutForm').submit()
  })

  //當全額折抵時
  if (
    $('#pay_type_pay_done_0').css('display') != 'none' &&
    $('.pay_area .paytype.active').text() == '全額折抵'
  ) {
    $('.FastCtrl_area').hide()
  }

  //預設打開收貨人資料填寫表單
  var openShippingForm = true

  //檢查訂購人縣市是否為外島
  $.each($('#consigneeCity option'), function () {
    if ($(this).val() == memberCityId) {
      //區域為外島時，打開收貨人表單，琉球鄉 296/綠島鄉 318/蘭嶼鄉 323
      if (
        memberCountyId == '296' ||
        memberCountyId == '318' ||
        memberCountyId == '323'
      ) {
        openShippingForm = true
      } else {
        openShippingForm = false
        return false
      }
    } else {
      openShippingForm = true
    }
  })


  //訂購人縣市為本島，收貨人同訂購人資料，訂購人縣市為外島，打開收貨人資料填寫表單
  //如果不是訪客&&不是外島居民，預設收貨人為 同訂購人
  if (!isVisitor && 
      memberCityId != '3' &&
      memberCityId != '4' &&
      memberCityId != '20' ) {
    $('#consigneeDefaultCheckbox').prop('checked', false)
    $('#consigneeDifferent_Content').show()
    $('.consigneeName').val(memberName)
    $('.consigneeMobile').val(memberPhone)
    $('.consigneeTel').val(memberTel)
    $('.consigneeEmail').val(memberEmail)
    $('.consigneeCity').val(memberCityId)
    $('.consigneeRegion').val(memberCountyId)
    $('.consigneeAddOftenPeople').val(false)
    
    $("#consigneeCity option[value='" + memberCityId + "']").prop(
     'selected',
     true
    )
    getCountryOptions(
      'consigneeRegion',
      memberCityId,
      memberCountyId
    )  
    
    $('.consigneeRoad').val(
      citysuperAddress != 'citysuper店取商品'
        ? memberRoad
        : citysuperAddress
    )  
  } else if (
    member_active_status != '1' &&
    citysuperAddress != 'citysuper店取商品'
  ) {
    if (member_active_status == '4') {
      // 訪客不預設句選同訂購人
      $('#consigneeDefaultCheckbox').prop('checked', false)
    } else if ('2' == member_active_status && hasAddress) {
      // 有地址資料則預填
      $("#firstCity  option[value='" + memberCityId + "']").prop(
        'selected',
        true
      )
      getCountryOptions('firstRegion', memberCityId, memberCountyId)
      $('.firstRoad').val(memberRoad)
      /*$("#firstCity").attr("disabled",true)
          $("#firstRegion").attr("disabled",true)
          $(".firstRoad").attr("disabled",true)*/
      //同訂購人
      $('#consigneeDifferent_Content').show()
      $('#consigneeDefaultCheckbox').prop('checked', false)
      //syncConsignee_data()
    } else {
      $('#consigneeDefaultCheckbox').prop('checked', false)
      $('#consigneeDifferent_Content').show()
    }
  }

  // 當資料不完全之使用者, 帶入其他訂購人資訊
  if (member_active_status == '3') {
    $('.firstName').val(memberName)
    $('.firstMobile').val(memberPhone)
    $('.firstTel').val(memberTel)
    $('.firstEmail').val(memberEmail)
    $('.firstMemAddCtrl_area').parent().hide()
    $('#consigneeDefaultCheckbox').prop('checked', true)
  }

  if (isVisitor) {
    $('#consigneeDifferent_Content').show()
    $('.invoiceContent_area').show()
    $('#invoiceDifferent').click() // 訪客發票預設自填
  }

  // 約定條款：是否同意 收到簡訊條款 與 會員條款 (正式會員與非首購影隱藏)
  if (
    member_active_status == '3' ||
    member_active_status == '1' ||
    !isfirstOrderpeople
  ) {
    $('.firstSmsMobileCtrl_area').parent().hide()
    $('.firstMemAddCtrl_area').parent().hide()
  }

  getAllinstallments()

  getAllpointsdeductibles()

  // 重新設置分期付款資訊的btn大小
  setTimeout(resize_width, 1500)
  if (member_active_status != 4) {
    //訪客無資料
    getMemberCreditCard(displayName)  //信用卡資訊
    getMemberLineCard()   //line 資訊
  } else {
    deleteVistorCreditCard()
  }

  //發票資訊
  if (member_active_status == 4 || isTaiPowerMember) {
    //塞訪客或台電會員發票資訊
    if (isTaiPowerMember) {
      $('.invoiceInfo_area').hide()
    }
    $(".invoiceInfo input[name='invoiceStaus']").val(0)
    $(".invoiceInfo input[name='invoiceConsignee']").val(1)
    $(".invoiceInfo input[name='verifyEInvoiceMobilePassCode']").val(0)
    $(".invoiceInfo input[name='invoiceProcessMethod']").val('eInvoice')
  } else {
    getMemberInvoice()
  }
})

function getAllinstallments() {
  $.ajax({
    url: mGH.apiService + 'allinstallments',
    type: 'GET',
    success: function (data) {
      if (data.response.status == 'OK') {
        $.each(data.payload, function (i, item) {
          var bankListTag = '.banklist.payTime_' + item.period
          var bankList = crateBankList(item.banksName)
          $(bankListTag).html(bankList)
        })
      }
    },
  })
}

function crateBankList(list) {
  var bankList = ''
  $.each(list, function (i, item) {
    bankList += '、' + item
  })
  return bankList.substring(1)
}

function getAllpointsdeductibles() {
  $.ajax({
    url: mGH.apiService + 'allpointsdeductibles',
    type: 'GET',
    success: function (data) {
      if (data.response.status == 'OK') {
        var bankListTag = '.banklist.bonusRedeem'
        var bankList = crateBankList(data.payload)
        $(bankListTag).html(bankList)
      }
    },
  })
}

var tempStoreInfo = null
function creatTempStoreInfo(data) {
  var message = ''
  var storeType = data.storeType
  var storeName = data.storeName
  var maskConsigneeName = maskString(data.consigneeName, 1, 1)
  var consigneeName = data.consigneeName
  var maskPhoneNumber = maskString(data.phoneNumber, 4, 3)
  var phoneNumber = data.phoneNumber
  var storeAddress = data.storeAddress
  var storeStatus = data.storeStatus
  var storeId = data.storeId
  var storeTypeName = ''
  if (storeType == 1) {
    storeTypeName = '7-11'
  } else if (storeType == 2) {
    storeTypeName = '全家'
  } else if (storeType == 8) {
    storeTypeName = '德誼'
  } else if (storeType == 9) {
    storeTypeName = '遠傳'
  }

  // 組選擇門市form所需資料
  data.maskConsigneeName = maskConsigneeName
  data.maskPhoneNumber = maskPhoneNumber
  data.isTemp = true

  callRESTAPI({
    method: 'POST',
    headers: { requestId: new Date().getTime() },
    path:
      mGH.apiHttp +
      mGH.apiDomain +
      mGH.apiView +
      mGH.apiService +
      'api/member/store/check',
    data: JSON.stringify(data),
    async: false,
    callback: function callback(msg) {
      if (msg.code != '1' || msg.message != 'OK') {
        message = msg.message
      } else {
        tempStoreInfo = data
        $('.super-market-items.temp').remove() // 移除先前的temp資料
        $('.select-smark-box .icon-radio').removeClass('in') // 移除勾選的門市
        var storeInfoHtml = $('.select-smark-box .select-supcomm-box').html() // 超商管理已存在的門市資料

        var tempStoreInfoHtml = `<div class="super-market-items temp N">
               <div class="super-market-radio">
                 <i class="icon-radio in"></i>
               </div>
               <div class="super-market-content">
                 <span><i class="supmkt_card_type_${storeType} storeInfo" storeStatus="${storeStatus}" phoneNumber="${phoneNumber}" consigneeName="${consigneeName}" storeId="${storeId}" storeAddress="${storeAddress}" storeType="${storeType}" storeTypeName="${storeTypeName}" storeName="${storeName}"maskPhoneNumber="${maskPhoneNumber}" maskConsigneeName="${maskConsigneeName}"></i></span> <span><i>${storeTypeName} ${storeName}</i> <i class="text-vermillion">[預設]</i></span> <span class="supmkt_card_info">${maskConsigneeName} ${maskPhoneNumber}<br>${storeAddress}
                 </span>
                 <div class="expire_mask" ${
                   storeStatus == 1 ? 'style="display: none"' : ''
                 } >
    				<i class="icon-expired"></i>
    			 </div>
               </div>
             </div>
             ${storeInfoHtml}`

        $('.select-smark-box .select-supcomm-box').html(tempStoreInfoHtml)

        $('.icon-radio').on('click', function () {
          var parents = $(this).parents('div')
          var allopts = parents.find('.icon-radio')
          allopts.removeClass('in')
          $(this).addClass('in')
          parents.find('.icon-value').val($('.icon-radio').index($(this)) + 1)
        })
        creatSelectStoreInfo()
      }
    },
    errcallback: function errcallback() {
      alert('此門市系統維護中，請選擇其他門市或聯繫客服人員。')
    },
  })

  return message
}

function checkStoreApplicable(storeType) {
  var isStoreApplicable = false // 門市是否適用於此訂單
  var isSeven = storeType == 1
  var isFamily = storeType == 2
  var isDE = storeType == 8
  var isFetnet = storeType == 9
  var isCvs = isSeven || isFamily

  // orderDelivery定義於step2.jsp
  var hasCvsDelivery = orderDelivery.indexOf('STORE') >= 0
  var hasDeDelivery = orderDelivery.indexOf('DE') >= 0
  var hasFetDelivery = orderDelivery.indexOf('FET') >= 0
  var isStorePay = $('.paytype.active')
    .attr('class')
    .startsWith('PAYTYPE_STOR_1')
  var isPaytypeDone = $('.paytype.active')
    .attr('class')
    .startsWith('PAYTYPE_DONE_0')

  if (hasCvsDelivery && isCvs) {
    isStoreApplicable = true
  }

  if (hasDeDelivery && isDE) {
    isStoreApplicable = true
  }
  if (hasFetDelivery && isFetnet) {
    isStoreApplicable = true
  }

  if (isStorePay) {
    // 超商取貨付款
    if (isDE || isFetnet) {
      // 德誼/遠傳門市不適用超商取貨付款
      isStoreApplicable = false
    }
  } else {
    // 一般付款(先付款) 刷卡、第三方支付...
    if (isCvs && !isPaytypeDone) {
      // 任一小訂單超商超過4000只能超商取貨付款(全額折抵不用判斷)
      $.each($('.orderAmount'), function () {
        if ($(this).val() > 4000) {
          isStoreApplicable = false
        }
      })
    }
  }

  return isStoreApplicable
}

function maskString(str, frontLen, endLen) {
  var len = str.length - frontLen - endLen
  var xing = ''
  for (var i = 0; i < len; i++) {
    xing += '*'
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
}

function creatStoreInfo(datalist) {
  var storeInfoHtml = ''
  var storeInfos = datalist.convenienceStoreInfos

  if (null != tempStoreInfo) {
    // 暫存資料擺最前面
    storeInfos.unshift(tempStoreInfo)
  }

  $.each(storeInfos, function (i, data) {
    var storeType = data.storeType
    var storeName = data.storeName
    var maskConsigneeName = data.maskConsigneeName
    var consigneeName = data.consigneeName
    var maskPhoneNumber = data.maskPhoneNumber
    var phoneNumber = data.phoneNumber
    var storeAddress = data.storeAddress
    var storeStatus = data.storeStatus
    var storeId = data.storeId
    var isTemp = data.isTemp ? true : false
    var isDefault = data.isDefault
    var expressCheckoutId = data.expressCheckoutId
    var storeTypeName = ''
    if (storeType == 1) {
      storeTypeName = '7-11'
    } else if (storeType == 2) {
      storeTypeName = '全家'
    } else if (storeType == 8) {
      storeTypeName = '德誼'
    } else if (storeType == 9) {
      storeTypeName = '遠傳'
    }

    var isStoreActivated = storeStatus == 1 // 門市是否為可使用狀態
    var isStoreApplicable = checkStoreApplicable(storeType) // 門市是否適用於此訂單

    var maskHTML = ''
    if (isStoreApplicable) {
      maskHTML += `<div class="expire_mask" ${
        isStoreActivated ? 'style="display: none"' : ''
      } >
                        <i class="icon-expired"></i>
                       </div>`
    } else {
      maskHTML += `<div class="expire_mask">
                        <i class="icon-not-applicable"></i>
                       </div>`
    }

    var isSelect = false
    //已使用者新增選取的為主
    if (selectStoreId != '') {
      //selectStoreId有值表示有新增或是選取過
      if (selectStoreId == expressCheckoutId) {
        isSelect = true
      }
    } else if (isDefault) {
      isSelect = true
    }

    storeInfoHtml += `<div class="super-market-items ${isTemp ? 'temp' : ''} ${
      isDefault ? 'Y' : 'N'
    }">
                <div class="super-market-radio">
                  <i class="icon-radio ${isSelect ? 'in' : ''} ${
      isStoreApplicable && isStoreActivated ? '' : 'disable'
    }"></i>
                </div>
                <div class="super-market-content">
                  <span><i class="supmkt_card_type_${storeType} storeInfo" phoneNumber="${phoneNumber}" expressCheckoutId="${expressCheckoutId}" storeStatus="${storeStatus}" consigneeName="${consigneeName}" storeId="${storeId}" storeAddress="${storeAddress}" storeType="${storeType}" storeTypeName="${storeTypeName}" storeName="${storeName}"maskPhoneNumber="${maskPhoneNumber}" maskConsigneeName="${maskConsigneeName}"></i></span> <span><i>${storeTypeName} ${storeName}</i> <i class="text-vermillion">[預設]</i></span> <span class="supmkt_card_info">${maskConsigneeName} ${maskPhoneNumber}<br>${storeAddress}
                  </span>
                  ${maskHTML}
                </div>
              </div>`
  })

  $('.select-smark-box .select-supcomm-box').html(storeInfoHtml)
  var topHight = $('.select-smark-box .page_head').outerHeight()
  var wundiwHight = $('.select-smark-box .card-button').outerHeight()
  var maxHight = $(window).height() - (wundiwHight + topHight + 10)
  $('.select-supcomm-box').attr('style', 'height: ' + maxHight + 'px')

  $('.icon-radio').on('click', function () {
    var parents = $(this).parents('div')
    var allopts = parents.find('.icon-radio')
    allopts.removeClass('in')
    $(this).addClass('in')
    parents.find('.icon-value').val($('.icon-radio').index($(this)) + 1)
  })
}

function creatSelectStoreInfo() {
  var storeInfo = $('.select-smark-box .icon-radio.in')
    .parents('.super-market-items')
    .find('.storeInfo')
  if (storeInfo.size() <= 0) {
    return
  }

  var storeStatus = storeInfo.attr('storeStatus')

  var storeType = storeInfo.attr('storetype')
  var storeName =
    storeInfo.attr('storeTypeName') + ' ' + storeInfo.attr('storeName')
  var storeMember =
    storeInfo.attr('maskConsigneeName') +
    ' ' +
    storeInfo.attr('maskPhoneNumber')

  var html = `<div class="smark_info flex">
    <i class="supmkt_card_type_${storeType}"></i>${storeName}
    </div>
    <div style="margin-top: 5px;">${storeMember}</div>
    <div style="margin-top: 5px;">${storeInfo.attr('storeAddress')}</div>`
  $('#store .oneArea-cont.isSelected').html(html)

  $('#store .oneArea-cont').hide()

  if (checkStoreApplicable(storeType)) {
    //門市是否適用
    if (storeStatus == 1) {
      //門市有效
      $('#store .oneArea-cont.isSelected').show()
      $('#storeId').val(storeInfo.attr('storeId'))
      $('#storeName').val(storeInfo.attr('storeName'))
      $('#storeAddress').val(storeInfo.attr('storeAddress'))
      $('#storeType').val(storeType)
      $('#consigneeDifferent_Content')
        .find('.consigneeName')
        .val(storeInfo.attr('consigneeName'))
      $('#consigneeDifferent_Content')
        .find('.consigneeMobile')
        .val(storeInfo.attr('phonenumber'))
    } else {
      $('#store .oneArea-cont.isFail').show()
    }
  } else {
    //沒門市不適用 現顯示訊息及門市資訊
    $('#store .oneArea-cont.isForbidden').show()
    $('#store .oneArea-cont.isSelected').show()
    $('#storeId').val('')
    $('#storeName').val(storeInfo.attr(''))
    $('#storeAddress').val(storeInfo.attr(''))
  }

  $('#store .change-entry').text('變更')
}

var displayName = false

function choiseCard(trigger) {
  // input radio - icon-radio-value
  // $('.credit-card-selection .icon-radio').on('click', function () {  //點擊信用卡列表的radio
  //   var parents = $(this).parents('div')
  //   var allopts = parents.find('.icon-radio')
  //   allopts.removeClass('in')
  //   $(this).addClass('in')
  //   parents.find('.icon-value').val($('.icon-radio').index($(this)) + 1)
  // })
  if (trigger) {
    if ($('.PAYTYPE_DONE_0.paytype.active').size() == 0) {
      //全額折抵不勾選
      if (cartTypeId == 2) {
        // 遠傳門市取貨預設信用卡一次付清，超商取貨預設取貨付款
        if (
          orderDelivery.indexOf('DE') >= 0 ||
          orderDelivery.indexOf('FET') >= 0
        ) {
//          $('.radio.PAYTYPE_CARD_1').trigger('click')
          $('.change-payment-opts-box .paytype')[0].click()
        } else {
          $('.radio.PAYTYPE_STOR_1').trigger('click')
        }
        getMemberStore()
        creatSelectStoreInfo()
      } else {
//        $('.radio.PAYTYPE_CARD_1').trigger('click')
      }
    } else if (
      $('.PAYTYPE_DONE_0.paytype.active').size() == 1 &&
      cartTypeId == 2
    ) {
      //門市車 全額折抵時
      getMemberStore()
      creatSelectStoreInfo()
    }
  }
  if ($('.paytype.active').size() == 0) {
    //若無信用卡  並未預選時付款方式，超取商品幫域選
    if (cartTypeId == 2 && orderDelivery.indexOf('STORE') >= 0) {
      $('.radio.PAYTYPE_STOR_1').trigger('click')
    } else {
//      $('.radio.PAYTYPE_CARD_1').trigger('click')
      $('.change-payment-opts-box .paytype')[0].click();
    }
    if (cartTypeId == 2) {
      getMemberStore()
      creatSelectStoreInfo()
    }
  }

  var choise = $('.paytype.active').attr('class')  //是否有選擇付款方式

  var hasCard = $('.credit-card-selection').find('.icon-radio.in').size()   //是否有選擇信用卡

  if (choise != undefined) {  //以下為付款方式最外層填值
    var payTypeHtml = ''
    if (choise.startsWith('PAYTYPE_CARD') && hasCard > 0) {
      // 信用卡相關 包含紅利
      var bankName = $('.paylist .credit-card-items .icon-radio.in')
        .parents('.credit-card-items')
        .find('.bankName')
        .attr('data')

      var number = $('.paylist .credit-card-items .icon-radio.in')
        .parents('.credit-card-items')
        .find('.text-lighter')
        .text()
        .substr(0, 9)
      
      var tag = $('.paylist .credit-card-items .icon-radio.in')
        .parents('.credit-card-items')
        .find('span:eq(1) i')[0].outerHTML

      //最外層顯示的付款資訊欄
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>${bankName}</p>
                              <p><span>${number}</span>${tag}</p>
                            </div>
                            <div class="flex-box oneArea-cont">
                              <input type="number" class="fastCard3Num color_grey" name="fastCard3Num" placeholder="請輸入安全碼" maxlength="3">
                            </div>`

      //         payTypeHtml+='<input type="tel" class="text-lighter fastCard3Num" name="fastCard3Num" placeholder="請輸入安全碼" maxlength="3"> <ol>'
      //  payTypeHtml+='	<li>'+bankName+'</li>'
      //  payTypeHtml+='	<li>'+number+' '+tag+'</li></ol>';


      //準備結帳時要post到後端的信用卡id
      $('#cardExpressCheckoutId').val(   
        $('.paylist .credit-card-items .icon-radio.in')
          .parents('.credit-card-items')
          .find('input')
          .val()
      )
    } else if (choise.startsWith('PAYTYPE_LINE_PAY')) {
      // linePay
      const linePayContent = mGH.linePayNum ? `<p>${mGH.linePayNum}</p>` : '';

      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>LINE Pay</p>${linePayContent}
                            </div>`

      if($('.line-selection input').length > 0){  
        var linpayChoise = $('.line-selection input').val();
        let lineStatus = 'Y'
        if(linpayChoise == 2){
          lineStatus= 'N'
        }
        $("#linepayAuto").val(lineStatus);  //line信用卡選取結果填值(form表單)
      }
    } else if (choise.startsWith('PAYTYPE_HG_PAY')) {
      // happy go
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>HAPPY GO Pay</p>
                            </div>`
    } else if (choise.startsWith('PAYTYPE_JKO_PAY')) {
      // 街口
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>街口支付</p>
                            </div>`
    } else if (choise.startsWith('PAYTYPE_MATM')) {
      // ATM
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>ATM付款</p>
                            </div>`
    } else if (choise.startsWith('PAYTYPE_STOR_1')) {
      // 超取 按鈕文案顯示
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>超商取貨付款</p>
                            </div>`
    } else if (choise.startsWith('PAYTYPE_APPLE_PAY')) {
      // Apple Pay
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>Apple Pay</p>
                            </div>`
    } else if (choise.startsWith('PAYTYPE_GOOGLE_PAY')) {
      // Google Pay
      payTypeHtml = `<div class="flex-box oneArea-cont color_grey">
                              <p>Google Pay</p>
                            </div>`
    } else {
      payTypeHtml = `<div class="flex flex_align_center border_bottom padding_bottom area evt-open-popup" data-target="change-payment-opts-box"  onclick="popPage($(this)>
                                <div class="flex-box oneArea-cont color_red">
                                  <p>請選擇付款方式</p>
                                </div>
                              </div> `
    }

    var payTypeName = choise.split(' ')[0]
    $('#payTypeName').val(payTypeName)  //付款方式填值(from表單)
    
    //   $("#pay_types .oneArea-cont").html(payTypeHtml);
    $('#pay_types .border_bottom').html(payTypeHtml)
  }
}

//檢查行動電話欄位
function checkMoblie(phone_num, check_usage) {
  
  //var validation = true;
  var mobilePhone = phone_num
  var errorMsg = ''
  //  if (null == mobilePhone || $.trim(mobilePhone)
  //    .length <= 0) {
  //    errorMsg = ",本欄位不可為空";
  //    //validation = false;
  //  }
  if (mobilePhone.length != 0) {
    if (check_usage) {
      /*var mobileUsageWarning = $('#mobile_error')
	      .attr("value")
	    if (mobileUsageWarning == 1) {
	      errorMsg += ",此行動電話號碼使用次數超過三次";
	    }*/
      // if (!canUsedMobilePhone(phone_num)) {
      //   errorMsg += '此行動電話號碼已為friDay會員'
      // }
    }
    if (isNaN(mobilePhone) == true) {
      errorMsg += '不可包含其他字元'
      // validation = false;
    }
    if (null == mobilePhone || mobilePhone.length < 10) {
      errorMsg += '字數不足'
      //validation = false;
    }
    var re = /^09/
    if (mobilePhone.match(re) == null) {
      errorMsg += '必須為09開頭'
      //validation= false;
    }
  } else {
    errorMsg += '請填寫手機號碼'
  }
  return errorMsg
}

//檢查電子郵件信箱欄位

function checkEmail(email_addr, check_usage) {
  //var validation = true;
  var email = email_addr
  var errorMsg = ''
  if ((null == email || $.trim(email).length <= 0 ) && !isVisitor) {  //訪客email非必填欄位
    errorMsg = '本欄位不可為空'
    return errorMsg
    //validation = false;
  }

  if (email!= '' && check_usage) {
    var emailUsageWarning = $('#email_error').attr('value')
    if (emailUsageWarning == 1) {
      errorMsg += ',' + check_usage
    }
  }
  //開頭第一個字一定要為英文或數字，第一字之後可為多個英數字.號-號組合(ex: ab-c@、ab.c-1234@、abc.123-acv@)，@為必要，＠後最後一個.前接多個.或-加上英數字組合但第一字一定要為英數字(ex: @abc.a-c.com.tw、＠c-sdf-fds-w.c.com.tw)
  var emailRule =
    /^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
  //emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  if (email!= '' && email.search(emailRule) == -1) {
    errorMsg += '信箱格式錯誤'
    //validation = false;
  }
  return errorMsg
}

//檢查市話欄位
function checkTel(tel_num) {
  //var validation = true;
  var tel = tel_num
  var errorMsg = ''
  //  if (null == tel || $.trim(tel)
  //    .length <= 0) {
  //    errorMsg = ",本欄位不可為空";
  //    //validation = false;
  //  }

  if (tel_num) {
    var telFormat = /^(0\d{1,3})?-?\d{5,8}(#\d{1,6})?$/

    if (tel.length != 0 && telFormat.test(tel) == false) {
      errorMsg += ',格式錯誤'
      //validation = false;
    }
  }
  return errorMsg
}
// 檢查email使用次數
var emailErrorMessage = ''

/*function checkEmailUsage(email) {
  callRESTAPI({
    method: 'GET',
    path: mGH.apiService + "member/email",
    data: {
      'email': email,
      'activatedStatus': $("input[name='activatedStatus']")
        .val()
    },
    callback: function(msg) {
      if (msg.response.status != 'OK' || msg.response.message != 'Success') {
        console.log(msg.response.status)
        console.log(msg.response.message)
        console.log("json有問題請檢查")
        alert(msg.response.message)
        return false;
      }
      var p = msg.payload.usage;
      var fridayMember = msg.payload.isFridayMember;
      if (parseInt(p) >= 9) {
        $('.firstEmail')
          .addClass('errorView')
        //						$('#email_error').text("此email 已經存在於friDay購物中" + p + "次")
        emailErrorMessage = "此電子郵件信箱使用次數超過九次";
        alert("此Email已超過註冊次數，無法再註冊！")
        $('#email_error')
          .attr("value", "1")
      } else if (fridayMember) {
        $('.firstEmail')
          .addClass('errorView')
        emailErrorMessage = "此Email已存在會員！";
        alert("此Email已存在會員！")
        $('#email_error')
          .attr("value", "1")
      } else {
        $('.firstEmail')
          .removeClass('errorView')
        $('#email_error')
          .text("")
        $('#email_error')
          .attr("value", "0")
      }
    }
  })

}*/
//檢查行動電話使用次數
function checkMphoneUsage(mphone) {
  var errorCount = $('#mobile_error').attr('value')

  console.log(errorCount)

  if (errorCount == 2) {
    $('.firstMobile').one('click', function () {
      needCheckCaptcha()
    })
  }

  callRESTAPI({
    method: 'GET',
    path:
      mGH.apiHttp +
      mGH.apiDomain +
      mGH.apiView +
      mGH.apiService +
      'api/member/regist/phoneUsage',
    data: {
      phone: mphone,
    },
    callback: function (msg) {
      if (!msg.payload[0].isVerify) {
        $('.firstMobile').addClass('errorView')
        if (!errorCount) {
          $('#mobile_error').attr('value', 1)
          errorCount = 1
        } else {
          errorCount++
          $('#mobile_error').attr('value', errorCount)
        }
        confirmCaptcha()
      } else {
        $('.firstMobile').removeClass('errorView')
        // $('#mobile_error').text('')
        if ($('#consigneeDefaultCheckbox').prop('checked')) {
          $('.consigneeMobile').val(mphone)
        }
      }
    },
  })
}

// 檢查手機門號是否可以使用:同步呼叫
function canUsedMobilePhone(mphone) {
  let canUsedPhone = true
  callRESTAPI({
    async: false,
    method: 'GET',
    path:
      mGH.apiHttp +
      mGH.apiDomain +
      mGH.apiView +
      mGH.apiService +
      'api/member/regist/phoneUsage',
    data: {
      phone: mphone,
    },
    callback: function (msg) {
      if (!msg.payload[0].isVerify) {
        canUsedPhone = false
      } else {
        canUsedPhone = true
      }
    },
  })
  return canUsedPhone
}

function resize_width() {
  // 結帳方式的按鈕-調整高度造成的偏差
  var payBtnH = 0
  if ($('.payBtnStyle').size() > 0) {
    payBtnH = $('.payBtnStyle').height()
  }
  if (payBtnH > 0) {
    $('.payBtnStyle').height(payBtnH)
  }
}

//判斷姓名是否符合格式
/**
 * 至少為兩個中文字
   姓名必須為中文字或英文字
   英文姓名僅能填入英文、空白或-
 */
function checkName(name) {
  var errorMsg = ''
  //	var isEng = new RegExp("[\ \-a-zA-Z]")
  //	var isChinese = new RegExp("[\u4e00-\u9fa5]")

  //是否為空值
  if (null == name || $.trim(name).length <= 0) {
    errorMsg += '本欄位不可為空'
    return errorMsg
  }

  //不可存在-特殊字元
  var otherChar = name.replace(/[A-Za-z-\s\u4e00-\u9fa5]/g, '')
  if (otherChar != '') {
    errorMsg += '不可輸入數字或特殊字元'
    return errorMsg
  }
  //不可存在-TAB鍵(\t)
  var tabChar = name.search(/\t/)
  if (tabChar != -1) {
    errorMsg += '不可輸入特殊字元'
    return errorMsg
  }
  //當英文被取代掉時候 應只剩下中文
  var onlyChinese = name.replace(/[A-Za-z-\s]/g, '')
  if (onlyChinese != '' && name.length != onlyChinese.length) {
    errorMsg += '不可中英夾雜'
  }
  //姓名如輸入中文，最少需輸入兩個字
  if (onlyChinese.length < 2 && onlyChinese.length != 0) {
    errorMsg += '需輸入兩個以上中文字元'
  }
  //不可輸入超過20個字
  if (name.length > 20) {
    errorMsg += '不可輸入超過20個字'
  }
  return errorMsg
}

//判斷超取名稱是否符合格式
/**
 * 至少為兩個中文字
   姓名必須為中文字或英文字
   英文姓名僅能填入英文、空白或-
 */
function checkNameForStore(name) {
  var errorMsg = ''
  //	var isEng = new RegExp("[\ \-a-zA-Z]")
  //	var isChinese = new RegExp("[\u4e00-\u9fa5]")

  //是否為空值
  if (null == name || $.trim(name).length <= 0) {
    errorMsg += ',本欄位不可為空'
    return errorMsg
  }

  //不可存在-特殊字元
  var otherChar = name.replace(/[A-Za-z-\s\u4e00-\u9fa5]/g, '')
  if (otherChar != '') {
    errorMsg += ',不可輸入數字或特殊字元'
    return errorMsg
  }
  //不可存在-TAB鍵(\t)
  var tabChar = name.search(/\t/)
  if (tabChar != -1) {
    errorMsg += ',不可輸入特殊字元'
    return errorMsg
  }
  //當英文被取代掉時候 應只剩下中文
  var onlyChinese = name.replace(/[A-Za-z-\s]/g, '')
  var onlyEnglish = name.replace(/[\u4e00-\u9fa5-\s]/g, '')
  /*if (onlyChinese != "" && name.length != onlyChinese.length) {
    errorMsg += ",不可中英夾雜";
  }*/
  //姓名如輸入中文，最少需輸入兩個字
  if (
    onlyEnglish.length == 0 &&
    onlyChinese.length != 0 &&
    onlyChinese.length < 2
  ) {
    errorMsg += ',需輸入兩個以上中文字元'
  }
  //姓名如輸入中文，不可輸入超過五個字
  if (onlyEnglish.length == 0 && onlyChinese.length > 5) {
    errorMsg += ',不可輸入超過五個中文字元'
  }
  //純英文至少需4-10個字
  if (
    (onlyEnglish.length != 0 &&
      onlyChinese.length == 0 &&
      onlyEnglish.length <= 3) ||
    onlyEnglish.length > 10
  ) {
    errorMsg += ',英文至少要輸入4個字元,且不可超過10個字元'
  }
  //中文一個字時,英文至少需兩個字
  if (onlyChinese.length == 1 && onlyEnglish.length < 2) {
    errorMsg += ',只有1個中文字，至少還需輸入2個英文字元'
  }
  //字數不可超過十個字元
  if (name.length > 10) {
    errorMsg += ',不可為超過十個字元'
  }
  return errorMsg
}

function checkRoad(road) {
  var errorMsg = ''
  var addrFormat = new RegExp('[路街道號]')

  if (null == road || $.trim(road).length <= 0) {
    errorMsg += '請輸入地址'
    return errorMsg
  }

  if (addrFormat.test(road) == false) {
    errorMsg += ',須包含路、街、道、號其中一個字元'
  }

  var otherChar = road.replace(/[\w-\s\u4e00-\u9fa5]/g, '')
  if (otherChar != '') {
    errorMsg += ',不可輸入特殊字元'
  }
  return errorMsg
}
// 檢查統一編號, 規則來自http://service.etax.nat.gov.tw/etwmain/resources/web/js/etw.commonUtil.js
function checkInvoice(value) {
  var banResult = false
  if (value.length != 8 || value.trim() == '') {
    banResult = false
  }
  var intMod //餘數變數
  var intSum //合計數變數
  var intX = new Array(1, 2, 1, 2, 1, 2, 4, 1)
  var intY = new Array(7)
  var intCount //計數變數
  for (intCount = 0; intCount < 8; intCount++) {
    if (value.charAt(intCount) < '0' || value.charAt(intCount) > '9') {
      banResult = false
    }
  }
  for (intCount = 0; intCount < 8; intCount++) {
    intX[intCount] *= parseInt(value.charAt(intCount))
  }
  intY[0] = parseInt(intX[1] / 10)
  intY[1] = intX[1] % 10
  intY[2] = parseInt(intX[3] / 10)
  intY[3] = intX[3] % 10
  intY[4] = parseInt(intX[5] / 10)
  intY[5] = intX[5] % 10
  intY[6] = parseInt(intX[6] / 10)
  intY[7] = intX[6] % 10

  intSum =
    intX[0] +
    intX[2] +
    intX[4] +
    intX[7] +
    intY[0] +
    intY[1] +
    intY[2] +
    intY[3] +
    intY[4] +
    intY[5] +
    intY[6] +
    intY[7]
  intMod = intSum % 10

  if (value.charAt(6) == '7') {
    if (intMod == 0) {
      banResult = true
    } else {
      intSum = intSum + 1
      intMod = intSum % 10
      if (intMod == 0) {
        banResult = true
      } else {
        banResult = false
      }
    }
  } else {
    if (intMod == 0) {
      banResult = true
    } else {
      banResult = false
    }
  }
  return banResult
}
//判斷密碼是否符合格式
/**
 * 密碼不得與帳號相同
   密碼長度需大於8字元
   密碼需為大小寫英文字母或數字，不可使用符號或空白
 */
function checkPass(pass) {
  var errorMsg = ''
  var that = $('.firstOrderpeople_area')

  var password_pattern = /^(?!.*[^a-zA-Z0-9])(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/
  var password_reg = pass.match(password_pattern)

  if (password_reg == null) {
    errorMsg += ',密碼格式錯誤'
  }

  //是否為空值
  if (null == pass || $.trim(pass).length <= 0) {
    errorMsg += ',本欄位不可為空'
    return errorMsg
  }

  var account = that.find('.firstEmail').val()
  //密碼不得與帳號相同
  if (pass == account) {
    errorMsg += ',密碼不得與帳號相同'
    //return errorMsg;
  }

  //不可存在-符號或空白
  var otherChar = pass.replace(/[\w]/g, '')
  if (otherChar != '') {
    errorMsg += ',密碼需為大小寫英文字母或數字，不可使用符號或空白'
    //return errorMsg;
  }

  //密碼長度需大於8字元
  if (pass.length < 8) {
    errorMsg += ',密碼長度需大於8字元'
  }

  //密碼長度需小於20字元
  if (pass.length > 20) {
    errorMsg += ',密碼長度需小於20字元'
  }

  return errorMsg
}

//判斷再次輸入密碼是否符合格式
/**
 * 密碼與再次輸入密碼需一致
 
 */
function checkPassAgain(passAgain) {
  var errorMsg = ''
  var that = $('.firstOrderpeople_area')

  //是否為空值
  if (null == passAgain || $.trim(passAgain).length <= 0) {
    errorMsg += ',本欄位不可為空'
    return errorMsg
  }

  var pass = that.find('.firstPass').val()
  //密碼不得與帳號相同
  if (passAgain != pass) {
    errorMsg += ',密碼與再次輸入密碼需一致'
  }
  return errorMsg
}

if (typeof mGH.MessageBox == 'undefined') {
  mGH.MessageBox = window.fridayComponent.MessageBox
}

var captchaHtml = `<div class="captchaStep2">
                    <div>請輸入圖片中的驗證碼後繼續。</div>
                    <div style="display: flex; align-items: center;">
                        <img id="captcha" src="" width="80" height="25" class="captchaImg"><input type="button" onclick="refreshCaptcha()" class="refreshCaptcha">
                    </div>    
                    <div>
                        <input id="captchaAns" class="captchaInput" name="captchaAns" type="text" maxlength="6" placeholder="請輸入驗證碼">
                        <span class="captchaErrorMsg">驗證碼錯誤，請重新輸入。</span>
                    </div>
                    <input type="button" class="captchaCheck" value="確認" onclick="doCheckCaptcha()">
                </div>`

const checkCaptcha_MsgT = mGH.MessageBox.template.fridayMessage({
  name: 'friday_message_box_checkCaptcha',
  message: captchaHtml,
  btnPos: 'center',
})
const checkCaptcha_MsgB = new mGH.MessageBox(checkCaptcha_MsgT)

function doCheckCaptcha() {
  var message = checkCaptcha()
  // 驗證成功不會有回傳訊息
  if (message === undefined) {
    $('#mobile_error').attr('value', 0)
    checkCaptcha_MsgB.hide()
  } else {
    $('.captchaStep2').addClass('captchaError')
  }
}

function needCheckCaptcha() {
  checkCaptcha_MsgB.isTriggerCloseOverlay = false
  checkCaptcha_MsgB.init()
  checkCaptcha_MsgB.show()
  refreshCaptcha()
}

function confirmCaptcha() {
  var btns = []
  btns.push(
    {
      name: 'close',
      className: 'mr-2',
      text: '取消',
      action: () => alert_MsgB.hide() + $('.firstMobile').val(''),
    },
    {
      name: 'login',
      className: 'primary',
      text: '登入',
      action: function () {
        alert_MsgB.hide()
        location.replace(
          window.location.protocol +
            '//' +
            window.location.host +
            '/mobileweb/login?requestURL=' +
            window.location.protocol +
            '//' +
            window.location.host +
            '/mobileweb/checkout/step' +
            cartTypeId
        )
      },
    }
  )

  const alert_MsgT = mGH.MessageBox.template.fridayMessage({
    name: 'friday_message_box_alert_ok',
    message: '此手機號碼已成為會員，請登入帳號購買或重新輸入！',
    btnPos: 'right',
    btns: btns,
  })
  const alert_MsgB = new mGH.MessageBox(alert_MsgT)
  alert_MsgB.isTriggerCloseOverlay = false
  alert_MsgB.init()
  alert_MsgB.show()
  refreshCaptcha()
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}


// --------------------------------發票資訊--------------------------------

var invoiceEnum = {
  1: {
    displayName: '雲端發票捐贈',
  },
  2: {
    displayName: '個人紙本發票',
  },
  3: {
    displayName: '公司用郵寄',
  },
  4: {
    displayName: '個人雲端發票',
    typeName: '會員載具',
  },
  5: {
    displayName: '個人雲端發票',
    typeName: '手機條碼載具',
  },
  6: {
    displayName: '自然人憑證',
  },
  7: {
    displayName: '公司用(線上列印)',
  },
}

let alertUI = null

// 發票說明內容(1: 雲端發票捐贈 4: 個人電子發票 7: 公司用線上列印)
var invoiceMsg = {
  4: {
    name: 'friday_message-box-invoice',
    message:
      `
      <ul>
        <li>
          <p>friDay購物已採用電子發票，開立 後可至【訂單查詢】點選「發票資訊」，即可查詢發票圖像。</p>
        </li>
        <li>
          <p>電子發票會在開獎次日自動兌獎，如中獎會於次月5號以紙本寄送【掛號信】至會員地址(使用手機載具將由財政部自動兌獎)。</p>
        </li>
        <li>
          <p>依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。<a href="https://www.einvoice.nat.gov.tw/">(財政部電子發票流程說明)</a></p>
        </li>
      </ul>
      `,
    btnPos: 'right',
    btns: [
      {
        name: 'close',
        className: 'primary',
        text: '確認',
        action: function () {
          // only for cancel
          alertUI.hide()
        },
      },
    ],
  },
  1: {
    name: 'friday_message-box-invoice',
    message:
      `
      <ul>
        <li>
          <p>依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。<a href="https://www.einvoice.nat.gov.tw/">(財政部電子發票流程說明)</a></p>
        </li>
      </ul>
      `,
    btnPos: 'right',
    btns: [
      {
        name: 'close',
        className: 'primary',
        text: '確認',
        action: function () {
          // only for cancel
          alertUI.hide()
        },
      },
    ],
  },
  7: {
    name: 'friday_message-box-invoice',
    message:
      `
      <ul>
        <li>
          <p>如您需紙本發票，請至【訂單查詢】點選「發票資訊」直接下載列印PDF。</p>
          <p>依統一發票使用辦法規定：電子發票一經開立，不得任意更改或改開公司發票。<a href="https://www.einvoice.nat.gov.tw/">(財政部電子發票流程說明)</a></p>
        </li>
      </ul>
      `,
    btnPos: 'right',
    btns: [
      {
        name: 'close',
        className: 'primary',
        text: '確認',
        action: function () {
          // only for cancel
          alertUI.hide()
        },
      },
    ],
  },
}

var personalInvoiceArea =  $(`.invoiceInformation .oneInvoiceArea[type=4]`);  //個人電子發票區塊
var companyInvoiceArea = $(`.invoiceInformation .oneInvoiceArea[type=7]`) // 公司電子發票區塊

function checkEInvoiceVehicle(mobileCode) {  //檢查手機條碼格式
  var result = false

  mobileCode = encodeURIComponent(mobileCode)
  callRESTAPI({
    method: 'POST',
    path: mGH.apiService + 'checkEInvoiceVehicle?barCode=' + mobileCode,
    data: 'barCode=' + mobileCode,
    async: false,
    callback: function (msg) {
      //console.log(msg)
      if (!mGH.AjaxCheck_fn(msg)) {
        alert('驗證失敗')
        return false
      }

      result = msg.payload.result == 'Y'
      return result
    },
  })

  return result
}

$('.oneInvoiceArea .vehicle').change(function(){   //手機條碼input change事件(個人電子發票區塊新增invotype attribute & 若輸入框有值顯示刪除按鈕反之亦然)
  if($(this).val().length > 0){
    $(personalInvoiceArea).attr('invoType', 5) 
    $(personalInvoiceArea).find('.deleteVehicleBtn').addClass('in')
  }else{
    $(personalInvoiceArea).removeAttr('invoType')
    $(personalInvoiceArea).find('.deleteVehicleBtn').removeClass('in')
  }
})

$('.oneInvoiceArea .vehicle').keyup(function(){
  let value = $(this).val()
  $(this).val(value.toUpperCase())
})

$('.oneInvoiceArea .deleteVehicleBtn').click(function(){  //點擊刪除按鈕清空手機條碼載具input值
  $(personalInvoiceArea).find('.vehicle').val('').trigger('change')
})


$('.invoice-instructions').on('click', function (e) {  //點擊各種發票說明顯示popup
  const type = $(this).closest('.oneInvoiceArea').attr('type');
  e.preventDefault();

  const fridayMsgBox = window.fridayComponent.MessageBox
  const customCusBox = fridayMsgBox.template.fridayMessage(invoiceMsg[type])
  alertUI = new fridayMsgBox(customCusBox)

  alertUI.init()
  alertUI.show()
})



//取得使用者發票資料
function getMemberInvoice() {
  let ticket = getCookie('FEEC-B2C-TICKET');
  callRESTAPI({
    method: 'GET',
    headers: { requestId: new Date().getTime(), deviceType: 'MOBILE' , 'authorization': `Bearer${ticket}`},
    path:
      mGH.apiHttp +
      mGH.apiDomain +
      mGH.apiView +
      mGH.apiService +
      'api/member/invoice',
    async: false,
    callback: function callback(msg) {
      if (msg.code != '1') {
        console.log('code:' + msg.code)
        console.log('message:' + msg.message)
        console.log('json有問題請檢查')
        alert(msg.message)
        return false
      }

      mGH.memberInvoice = msg.payload[0].invoiceInfos
      $.each(mGH.memberInvoice, function (i,item) {
        if(item.type == 5) {  //若之前有設定過手機條碼則input填入使用者手機條碼 & 在個人電子發票區塊加入invoType=5
          $(personalInvoiceArea).attr('invoType', item.type) 
          $(personalInvoiceArea).find('.vehicle').val(item.vehicle)
          const vehicleValue = $(personalInvoiceArea).find('.vehicle').val()
          if(vehicleValue.length > 0){
            $(personalInvoiceArea).find('.deleteVehicleBtn').addClass('in')
          }
        }else if (item.type == 7){ //若之前有設定過公司電子發票則input填入統一編號和公司名稱
          $(companyInvoiceArea).find('.vat').val(item.vat)
          $(companyInvoiceArea).find('.company').val(item.company)
        }
      })
      
    },
    errcallback: function errcallback() {
      alert('API 異常')
    },
  })
}


function updateMemberInvoice() {   //發票input驗證
  var type
  var company
  var vat
  var vehicle
  var modifyData

  $('.oneInvoiceArea .input-wrapper').removeClass('err');  //移除所有錯誤訊息

  var target = $('.invoiceInformation .oneInvoiceArea .icon-radio.in').closest('.oneInvoiceArea') //取得目前radio狀態為in的發票區塊
  type =  target.attr('type')
  if(type === '4' && target.attr('invoType')!== undefined){ //若為手機條碼載具則將type設定為5
    type = target.attr('invoType');
  }
  
  //選擇的發票欄位防呆(1: 雲端發票捐贈, 2: 個人紙本發票, 3: 公司用郵寄, 4: 會員載具(個人雲端發票), 5: 手機條碼載具(個人雲端發票), 6: 自然人憑證, 7: 公司用線上列印)
    if (type ==='4') { //會員載具(個人雲端發票)
      modifyData = {type: 4, isDefault: true, needSave: true}
    } else if (type ==='5') { //手機條碼載具(個人雲端發票)
      vehicle = $(target).find('.vehicle').val(); 
      if (vehicle == '') {
        $(target).find('.vehicle-wrapper').addClass('err');
        return false
      }
      if (vehicle.length > 0 && vehicle.length != 8) {
        $(target).find('.vehicle-wrapper').addClass('err');
        return false
      }
      
      var status = checkEInvoiceVehicle(vehicle)  //檢查手機條碼格式
      console.log(vehicle);
      console.log('status ' , status);
      if (!status) {
        $(target).find('.vehicle-wrapper').addClass('err');
        return false
      }
      modifyData = {type: 5, vehicle: vehicle, isDefault: true, needSave: true} //更新手機載具條碼

    }else if (type === '1'){ //雲端發票捐贈
      modifyData = {type: 1, id: '25885', name: '伊甸基金會', isDefault: false, needSave: true}
    }else if (type === '7') {  //公司線上
    
      let check = true;

      company = $(target).find('.company').val()
      vat = $(target).find('.vat').val()

      if (false == checkInvoice(vat)) {
        $(target).find('.vat-wrapper').addClass('err');
        check = false ;
      }

      if (!company) {
        $(target).find('.company-wrapper').addClass('err');
        check = false
      }
    
      if (!check) {
        return false
      }
      modifyData = {type: 7, vat, company, isDefault: false, needSave: true}
  }

  creatCheckOutInvoice(type , modifyData);
  return true;

}

//1: 雲端發票捐贈, 2: 個人紙本發票, 3: 公司用郵寄, 4: 會員載具(個人雲端發票), 5: 手機條碼載具(個人雲端發票), 6: 自然人憑證, 7: 公司用線上列印

function creatCheckOutInvoice(type, item) {
  $('.invoiceInfo input').val('')
  $(".invoiceInfo input[name='invoiceStaus']").val(0)
  $(".invoiceInfo input[name='invoiceConsignee']").val(1)
  $(".invoiceInfo input[name='verifyEInvoiceMobilePassCode']").val(0)
  var invoiceInfoHtml = ''
  console.log(item);
      $(".invoiceInfo input[name='invoiceType']").val(item.type)
      if (item.type == 1) {
        $(".invoiceInfo input[name='invoiceProcessMethod']").val('eInvoice')
        $(".invoiceInfo input[name='invoiceStaus']").val(1)
        $(".invoiceInfo input[name='invodonateid']").val(item.id)
        $(".invoiceInfo input[name='agency']").val(item.name)
        invoiceInfoHtml = `<p class="flex_box">${invoiceEnum[type].displayName}</p><p class="flex_box">${item.name}</p>`
      } else if (item.type == 7) {
        $(".invoiceInfo input[name='invoiceProcessMethod']").val('threeInvoice')
        $(".invoiceInfo input[name='invoiceConsignee']").val(0)
        $(".invoiceInfo input[name='companyname']").val(item.company)
        $(".invoiceInfo input[name='invoicevatnumber']").val(item.vat)
        invoiceInfoHtml = `<p class="flex_box">${invoiceEnum[type].displayName}</p><p class="flex_box">${item.vat}  ${item.company}</p>`
      } else if (item.type == 4) {
        $(".invoiceInfo input[name='invoiceProcessMethod']").val('eInvoice')
        invoiceInfoHtml = `<p class="flex_box">${invoiceEnum[type].displayName}</p><p class="flex_box">${invoiceEnum[type].typeName}</p>`
      } else if (item.type == 5) {
        $(".invoiceInfo input[name='invoiceProcessMethod']").val(
          'mobileInvoice'
        )
        $(".invoiceInfo input[name='eInvoiceMobileVehicleNumHidden']").val(
          encodeURIComponent(item.vehicle)
        )
        $(".invoiceInfo input[name='verifyEInvoiceMobilePassCode']").val(1)
        invoiceInfoHtml = `<p class="flex_box">${invoiceEnum[type].displayName}</p><p class="flex_box">${invoiceEnum[type].typeName} ${item.vehicle}</p>`
      } 
}

$('.slideArea').hide(); //最一開始slideArea為隱藏狀態
$('.invoiceInformation .icon-radio').click(function(){
  if($(this).hasClass('companyInvoiceRadio')){ //假設是公司發票且radio為未選取狀態，則展開該區域
      $('.slideArea').slideDown();
  }else{  //點選其餘radiobutton則收回該區域
    $('.slideArea').slideUp();
  }
})

// -------------------------------- 訪客付款方式 --------------------------------

function checkVisitorPayMethod (){
  var isCreditCardPay = $('.visitorPayType.active').hasClass('PAYTYPE_CARD_1');  

  if(isCreditCardPay){ //若選取付款方式為信用卡才做信用卡檢查
    var check = checkVisitorCreditCardInfo() //檢查信用卡格式 
    if(!check){
      return false 
    }
    //若無錯誤則將信用卡資訊填入step2表單中
    $("#cardName").val($('.credit-userName').val());
    $("#cardGroupNum").val($('.credit-number').val().replace(/\s+/g, ''));
    $("#cardYear").val('20'+$('.credit-card-m2').val());
    $("#cardMonth").val($('.credit-card-m1').val());
  }
  visitorChoiseCard();
  if ('2' == cartTypeId) {
    creatSelectStoreInfo()
  }

  return true
}
 
function visitorChoiseCard(){ //將付款方式填入step2 post表單
  var choise = $('.visitorPayType.active').attr('class') 
  var payTypeName = choise.split(' ')[0]
    $('#payTypeName').val(payTypeName)
}

// -------------------------------- 訪客訂購人資訊自動帶入收貨人資訊 --------------------------------

const firstOrderpeople_area = $(".firstOrderpeople_area");
const consigneeContent_area = $(".consigneeContent_area");
const firstOrderpeople_firstName = $(firstOrderpeople_area).find('.firstName');
const firstOrderpeople_firstMobile = $(firstOrderpeople_area).find('.firstMobile');
const consigneeContent_name =  $(consigneeContent_area).find('.consigneeName');
const consigneeContent_mobile = $(consigneeContent_area).find('.consigneeMobile');

$(firstOrderpeople_firstName).change(function(){ 
  if(consigneeContent_name.val() === ''){ //若使用者收貨人姓名欄位還未填，則由訂購人帶入
    consigneeContent_name.val($(firstOrderpeople_firstName).val()) 
  }
});

$(firstOrderpeople_firstMobile).change(function(){
  if(consigneeContent_mobile.val() === ''){ //若使用者收貨人手機欄位還未填，則由訂購人帶入
    consigneeContent_mobile.val($(firstOrderpeople_firstMobile).val()) 
  }
});


//------- 轉轉收貨人app介接(若app之前有儲存過收貨人，按修改收貨人會跳出調整popup，此方法為取得使用者在popup種所選擇的資料) -------

//popup監聽事件、取得先前是否有在app儲存過聯絡人
function appConsigneeInit(){
  try{
    window.addEventListener("setConsignee", (event) => { //popup選擇收貨人結果由app傳回事件綁定
      console.log("receiver's name -> " + event.detail.name);
      if(event && event.detail){
        $(`input[name='consigneename']`).val(event.detail.name);
        $(`input[name='consigneemobile']`).val(event.detail.mobileNo);
        $("#consigneeCity").find(`option:contains(${event.detail.city})`).prop('selected',true);
        $("#consigneeCity").change();
        $("#consigneeRegion").find(`option:contains(${event.detail.county})`).prop('selected',true);
        $(`input[name='consigneeroad']`).val(event.detail.address)
      }
    }, false);
    alert("init")
    f(checkAppHasConsignee);
    // const hasBefore = window.flutter_inappwebview.callHandler('hasConsignee');  //查看是否之前有儲存過聯絡人
  }catch(e){
    alert('app收貨人初始化錯誤')
    alert(e)
  }
}

//儲存收貨人資料
function saveConsigneeToApp(){  
  try{
    const consigneeObj = {}
    consigneeObj.name = $(`input[name='consigneename']`).val();
    consigneeObj.mobileNo = $(`input[name='consigneemobile']`).val();
    consigneeObj.city = $('.consigneeCity').find(':selected').text();
    consigneeObj.county = $(`.consigneeRegion`).find(':selected').text();
    consigneeObj.address = $(`input[name='consigneeroad']`).val();
    alert('ssss')
    window.flutter_inappwebview.callHandler('saveConsignee', consigneeObj).then(function(result){
      alert(12345)
    });
  }catch(e){
    alert('app儲存收貨人資料錯誤')
  }
}

//查看是否之前有儲存過聯絡人
function checkAppHasConsignee(){
  try{
    window.flutter_inappwebview.callHandler('hasConsignee').then(function(result){
      const hasBefore = JSON.stringify(result.hasConsignee)
      console.log("&&&&&",JSON.stringify(result.hasConsignee))  
      if(hasBefore){
        $('.consigneeContent_area h3').append(`<div class="appConsigneePopupBtn">常用收貨人資訊</div>`) //產生修改收貨人button
        $('.consigneeContent_area h3').off('click').on('click','.appConsigneePopupBtn',function(){ //常用收貨人點擊事件，展開popup
          window.flutter_inappwebview.callHandler('showConsigneeList');
        })
      }
    });  
  }catch(e){
    alert('儲存收貨人app錯誤')
  }
}
  


function callFlutter(){
  window.addEventListener("flutterInAppWebViewPlatformReady", function(event) {
    return function(cb){
      cb()
    }
  })
}

