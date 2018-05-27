var tumblr = new Vue({
	el: '#tumblr',
	data:{
		isLoading: false,
		apiUrl: 'https://api.tumblr.com/v2/tagged',
		apiParams: {
			api_key: 'gfriCKepweYPnYejxLqRmYUes0Qw8Qu7RPs0BtYHv2G6W0vxIQ',
			tag: 'goats',
			limit: 20
		},
		acceptedTypes: ['photo'],
		masterList: [],
		preloadList: [],
		error: '',
		errorMsgs: {
			noMatch: "There were no photo posts that matched your criteria.",
			loadFail: "There was an error loading your images. Please try again."
		}
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
			let strParams = '';
			let first = true;
			for(let param in this.apiParams){
				let separator = (first) ? '?' : '&';
				strParams = `${strParams}${separator}${param}=${this.apiParams[param]}`;
				first = false;
			}
			return `${this.apiUrl}${strParams}`;
		},
		gatherPhotos: function(){
			if(!this.isLoading){
				this.error = false;
				this.isLoading = true;
				this.$http.get(this.getApiUrl()).then(response => {

			    if(response.body.meta.status === 200){
			    	console.log(response.body.response);
			    	this.processResponse(response.body.response);
			    }else{
			    	this.displayError(this.errorMsgs.loadFail);
			    }

			  }, response => {
			    this.displayError(this.errorMsgs.loadFail);
			  });
		  }
		},
		processResponse: function(posts){
			let loopStop = Math.min(this.apiParams.limit, posts.length);
			if(loopStop > 0){
				for(let i = 0; i < loopStop; i++){
					let post = posts[i];

					let postTypeAccepted = this.acceptedTypes.find(type => {
						return type == post.type;
					});

					if(postTypeAccepted){
						this.preloadList.push(post.photos[0].original_size.url);
					}

					if(i === loopStop-1){
						this.apiParams.before = post.timestamp;
						this.preloadImages();
					}

				}
			}else{
				this.displayError(this.errorMsgs.noMatch);
			}
			

			console.log(this.preloadList);
			
		},
		preloadImages: function(){
			let inc = 0;
			for(let url of this.preloadList){
				let image = new Image();
				image.addEventListener('load', ()=>{
					inc++;
					this.checkPreloadComplete(inc);
				}, false);

				image.src = url;
			}
		},
		checkPreloadComplete: function(targetLength){
			if(this.preloadList.length == (targetLength+1)){
				this.masterList.push.apply(this.masterList, this.preloadList);
				this.preloadList = [];
				this.isLoading = false;
				this.offset = this.masterList.length;
			}
		},
		getDistFromBottom: function() {

  		// distance from bottom math from: https://codepen.io/timothyli/pen/JXVMZY
		  let scrollPosition = window.pageYOffset;
		  let windowSize = window.innerHeight;
		  let bodyHeight = document.body.offsetHeight;

		  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

		},
		displayError: function(error){
			this.error = error;
			this.isLoading = false;
		}
	},
	mounted: function(){
		this.init();
	}
});