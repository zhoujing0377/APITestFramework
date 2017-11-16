var config = require('../config/endpoints'),
    should = require('chai').should(),
    request = require('supertest')(config.host[config.env])


describe('Feature: Reservation\n  As a SA\n  I want to view the reservation list', function () {
    
    var token;
    var reservationId;

 //获取当前日期
    var dt = new Date(); 
    var mon = dt.getMonth() + 1;
    var day = dt.getDate()-1;
    var date = dt.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" +(day<10?"0"+day:day);
    
    it('Given SA can login to app', function(done) {
    var setModel = {
        username:'ZHOUJING',
        password: 'test@123',
        client_type: 'mobile'
    }
        request
        .post('account/api/login')
        .set('Content-Type','application/json')
        .send(setModel)
         .expect(200, function(err, res){    
            token=(JSON.parse(res.text)).jwt_token;
            done();
        });
    });

    
   it('When OAB post the new created reservation into OTR', function(done) {
    var setModel = {
        oab_reservation_id:'9',
        telephone: '13809884395',
        name: 'test',
        car_plate_number:'京ABC123',
        car_model: 'C200 运动款',
        booked_date: date+' 12:30:18',
        arrival_date:null,
        status:'10New',
        channel:'WECHAT',
        sa_id:'1',
        dealer_gssn:'XY03660166',
        service_type:'01,02',
        service_type_comments:'',
        notes:'automation e2e service test',
        fin:'1HGBH41JXMN109186Z',
        mileage:'123'
    }
        request
        .post('integration/oab/reservation')
        .set('Authorization','Bearer:'+token)
        .set('Content-Type','application/json')
        .send(setModel)
        .expect(200, function(err, res){    
            reservationId=(JSON.parse(res.text)).otr_reservation_id;
            done();
        });
    });

    it('And SA views the reservation for today', function (done) { 
        request
            .get('/tablet/reservations?currentDate='+date+'T16%3A00%3A00.000Z&isAssigned=false')
            .set('Content-Type','application/json')
            .set('Authorization','Bearer:'+token)
            .expect(200, function(err, res){  
                res.text.totalCount == 1;
            done();
         });
    });

    it('And SA can view the detail page for new reservation', function (done) {
        
        request
            .get('tablet/reservations/'+reservationId)
            .set('Content-Type','application/json')
            .set('Authorization','Bearer:'+token)
            .expect(200, function(err, res){  
            JSON.parse(res.text).id.should.to.equal(reservationId);  
            JSON.parse(res.text).should.to.have.property('carPlateNumber');
            done();
         });

    });
  
})