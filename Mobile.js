
let Mobile = function(name_phone, pin_capacity, pin_remaining, id) {
	this.network = [];
	// kích hoạt điện thoạt (mặc định tắt)
	this.el        = document.querySelector('#'+id);
	this.elStatus  = this.el.querySelector('.status');
	this.elPinMax  = this.el.querySelector('.pinMax');
	this.elPin     = this.el.querySelector('.pin');
	this.elThuDen  = this.el.querySelector('.thuDen');
	this.elThuDi   = this.el.querySelector('.thuDi');
	this.elContent = this.el.querySelector('.content');
	this.elStatus.innerText = 'OFF';

	this.active    = false;

	// Tên điện thoại
	this.name      = String(name_phone);

	// Pin
	this.battery   = new Battery(pin_capacity, pin_remaining);

	// Quản lý hòm thư
	this.messenger = new Messenger;
	this.update();
	this.init();
}

Mobile.prototype.update = function(){
	this.elThuDen.innerText = this.messenger.inBox.length;
	this.elThuDi.innerText  = this.messenger.sent.length;
	this.elPinMax.innerText = this.battery.capacity;
	this.elPin.innerText    = this.battery.remaining + ' ('+ this.battery.displayBattery() +')';
}

Mobile.prototype.init = function(){
	this.el.querySelector('.turnOn').addEventListener('click', function(){
		if (this.active === false) {
			this.turnOn();
			this.elStatus.innerText = 'ON';
		}
	}.bind(this));
	this.el.querySelector('.turnOff').addEventListener('click', function(){
		if (this.active === true) {
			this.turnOff();
			this.elStatus.innerText = 'OFF';
		}
	}.bind(this));
	this.el.querySelector('.viewInBox').addEventListener('click', function(){
		this.showInbox();
	}.bind(this));
	this.el.querySelector('.viewSent').addEventListener('click', function(){
		this.showSent();
	}.bind(this));
	this.el.querySelector('.write').addEventListener('click', function(){
		this.emitMessage();
	}.bind(this));
}

/**
	<p>Trạng thái: <span class="status"></span></p>
	<button class="turnOn">Bật.</button>
	<button class="turnOff">Tắt.</button>
	<button class="infoPin">Dung lượng pin còn lại.</button>
	<button class="viewInBox">Xem hòm thư đến</button>
	<button class="viewSent">Xem hòm thư đã gửi</button>
	<button class="write">Soạn tin nhắn</button>
	<div class="content"></div>
*/

// Trạng thái điện thoại
Mobile.prototype.getStatus = function(){
	return this.active;
}

// Tắt điện thoại
Mobile.prototype.turnOn = function(charge){
	if (this.battery.statusBattery() <= 0) {
		alert('Hết pin, vui lòng cắm sạc.');
	}else{
		this.active = true;
		this.powerDown();
	}
}

// Tắt điện thoại
Mobile.prototype.turnOff = function(){
	this.active = false;
}

// Sạc PIN
// Bắt đầu sạc (đang sạc)
Mobile.prototype.onCharge = function(charge){
	this.battery.onCharge(charge);
}
// Kết thúc sạc
Mobile.prototype.offCharge = function(){
	this.battery.offCharge();
}

// gửi tin nhắn cho một thiết bị khác
Mobile.prototype.emitMessage = function(device){
	if (this.active) {
		this.powerDown();
		let messenger = prompt('Nhập nội dung tin nhắn.');
		console.log(messenger);
		if (messenger !== null) {
			this.network[0].listenMessage(this, messenger);
			this.messenger.sent.push({name:this.name, text:messenger});
			this.update();
		}
	}
}

// nhận tin nhắn từ thiết bị khác
Mobile.prototype.listenMessage = function(device, messenger){
	if (this.active) {
		// chỉ nhận tin nhắn khi điện thoại bật
		this.messenger.inBox.push({name:device.name, text:messenger});
		this.powerDown();
	}
}
Mobile.prototype.powerDown = function(){
	this.battery.remaining--;
	if (this.battery.remaining <= 0) {
		this.turnOff();
	}
	this.update();
}

Mobile.prototype.showInbox = function(){
	if (this.active) {
		this.powerDown();
		let html = '<div><h4>Hòm thư đến:</h4><table><tbody>';
		for(let messenger of this.messenger.inBox){
			html += '<tr><td>'+messenger.name+'</td><td>'+messenger.text+'</td></tr>';
		}
		html += '</tbody></table></div>';
		this.elContent.innerHTML = html;
	}
}

Mobile.prototype.showSent = function(){
	if (this.active) {
		this.powerDown();
		let html = '<div><h4>Hòm thư đi:</h4><table><tbody>';
		for(let messenger of this.messenger.sent){
			html += '<tr><td>'+messenger.name+'</td><td>'+messenger.text+'</td></tr>';
		}
		html += '</tbody></table></div>';
		this.elContent.innerHTML = html;
	}
}
