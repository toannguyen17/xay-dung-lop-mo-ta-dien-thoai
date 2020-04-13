
let Battery = function(capacity, remaining) {
	this.isCharge  = false; // Trạng thái sạc
	this.setInfo(capacity, remaining);
}

// tình trạng pin (%)
Battery.prototype.statusBattery = function(){
	return ((this.remaining/this.capacity)*100)>>0;
}

// Hiển thị pin
Battery.prototype.displayBattery = function(){
	return this.statusBattery()+'%';
}

// đặt thông tin pin
Battery.prototype.setInfo = function(capacity, remaining){
	this.capacity  = Number(capacity);  // Sức chứa tối đa của pin (mAh)
	this.remaining = Number(remaining); // Dung lượng còn lại
	return this;
}

// Bắt đầu sạc (đang sạc)
Battery.prototype.onCharge = function(charge){
	this.isCharge = true;
	this.remaining += Number(charge);
}

// Kết thúc sạc
Battery.prototype.offCharge = function(){
	this.isCharge = false;
}
