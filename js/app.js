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
		},
		placeMaxImages: 3
	},
	methods:{
		init: function(){
			document.addEventListener('scroll', this.checkLoadNextImageBatch);
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
			this.isLoading = false;
			if(posts.length > 0){
				
				for(let i = 0; i < posts.length; i++){
					let post = posts[i];

					if(this.isPostTypeAccepted(post.type)){
						this.preloadList.push(post.photos[0].original_size.url);
					}

					if(i === posts.length-1){
						this.apiParams.before = post.timestamp;
						this.updateImageView();
					}
				}

			}else{
				this.displayError(this.errorMsgs.noMatch);
			}
			
		},
		isPostTypeAccepted: function(postType){
			return this.acceptedTypes.find(type => {
				return type == postType;
			});
		},
		updateImageView: function(){
			for(let i = 0; i < this.placeMaxImages; i++){
				this.masterList.push(this.preloadList[0]);
				this.preloadList.shift();
			}
		},
		getDistFromBottom: function() {
			const scrollPosition = window.pageYOffset;
	  	const windowSize = window.innerHeight;
	  	const bodyHeight = document.body.offsetHeight;

		  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
		},
		checkLoadNextImageBatch: function(){
			if(this.getDistFromBottom() < 20){
		 		if(this.preloadList.length < this.placeMaxImages){
		 			this.gatherPhotos();
		 		}else{
		 			this.updateImageView();
		 		}
		  }
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