
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

////////////////////////
const ItemSchema = new Schema({
uuid:{ 
		type:String ,
		required:false ,
		},
 name:{ 
	type:String ,
	required:false ,
	},
 content:{ 
	type:String ,
	required:false ,
	},
 showAt:{ 
	type:Number ,
	required:true ,
	default:0
	},
 hideAt:{ 
	type:Number ,
	required:true ,
	default:0
	},
 itemExtra:{ //this is very important item.extra has a lot of internal usage
 	type: Schema.Types.Mixed,
    required: true,
    default: {},
    }
});
///////////////////////////////////////////////////
///////////==SlidesSchema==////////////////////////
///////////////////////////////////////////////////
const SlidesSchema = new Schema({
    
	uuid:{ 
		type:String ,
		required:false ,
	},
	startTime:{ 
	type:Number ,
	required:false ,
	},
    endTime:{ 
	type:Number ,
	required:false ,
	},
    type:{ 
	type:String ,
	required:false ,
	},
	version:{ 
		type:String ,
		required:false ,
	},
    template:{ 
	type:String ,
	required:false ,
	default : ''
	},
	  
    items:{ 
	type:[ItemSchema] ,
	required:true ,
	default : []
	},
	
	slideExtra:{ 
		type: Schema.Types.Mixed,
	   required: true,
	   default: {},
	}
    
});


module.exports = {ItemSchema,SlidesSchema};