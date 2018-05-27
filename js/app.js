var tumblr = new Vue({
	el: '#tumblr',
	data:{
		isLoading: false,
		apiUrl: 'https://api.tumblr.com/v2/blog/goatsonthings/posts/photo',
		apiKey: 'gfriCKepweYPnYejxLqRmYUes0Qw8Qu7RPs0BtYHv2G6W0vxIQ',
		tag: 'goat-blog',
		limit: 10,
		offset: 0,
		masterList: [],
		preloadList: [],
		error: false
	},
	methods:{
		init: function(){
			document.addEventListener('scroll', ()=>{
			  if(this.getDistFromBottom() < 20){
			  	this.gatherPhotos();
			  }
			});
			this.gatherPhotos();
		},
		getApiUrl: function(){
			return `${this.apiUrl}?limit=${this.limit}&offset=${this.offset}&api_key=${this.apiKey}`;
		},
		gatherPhotos: function(){
			if(!this.isLoading){
				this.error = false;
				this.isLoading = true;
				this.$http.get(this.getApiUrl()).then(response => {

			    if(response.body.meta.status === 200){
			    	this.processResponse(response.body.response.posts);
			    }else{
			    	this.error = true;
			    	console.log(response.body.meta);
			    }

			  }, response => {
			    this.error = true;
			  });
		  }
		},
		processResponse: function(posts){
			let subset = [];
			for(let post of posts){
				const {url, width, height} = post.photos[0].original_size;

				let image = new Image();
				image.addEventListener('load', ()=>{
					this.preloadList.push({
						url,
						width,
						height
					});
					this.checkPreloadComplete();
				}, false);

				image.src = url;
			}
			
		},
		checkPreloadComplete(){
			if(this.preloadList.length == this.limit){
				this.masterList.push.apply(this.masterList, this.preloadList);
				this.preloadList = [];
				this.isLoading = false;
				this.offset = this.masterList.length;
			}
		},
		getDistFromBottom: function() {

  		// distance from bottom math from: https://codepen.io/timothyli/pen/JXVMZY
		  var scrollPosition = window.pageYOffset;
		  var windowSize     = window.innerHeight;
		  var bodyHeight     = document.body.offsetHeight;

		  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

		}
	},
	mounted: function(){
		this.init();
	}
});