<template>
  <div>
    <nav class="navbar">
      <div class="nav-contents container">
        <div class="row w-100">
          <div class="col-5">
            <img src="../assets/logo-white.png" class="float-left" style="width: 120px;">
          </div>
          
         <div class="col-2">
           
            <div style="width: 7em;">
              <button class="btn btn-test btn-block float-right" @click="mainMenu">Swap!</button>
            </div>
          </div>
          <div class="col-3 px-0">
            <span class="fa-stack fa-5x has-badge ml-auto" :data-count="tradeOffers.length">
              <button class="btn btn-test ml-auto pending-btn float-right" @click="tradeView">Pending Trades</button>
              <pending-trades ref="pendingTrades" v-bind="$props" :tradeOffers='tradeOffers'></pending-trades>
            </span>
          </div>
          <div class="col-2">
            <button class="btn btn-test signout float-right" @click="auth.logout">Sign Out</button>
            </button>
          </div>
        </div>
      </div>
    </nav>




    <div class="container main-container">
      <div class="card inner-container p-2" style="min-height: 10em;">
        <div ></div>
        <h1 id='swapperreviews'>{{email}}</h1>
        <div class="card pl-3 my-1 w-100 item-box">
          
          <div class="container">
            <div >
              
<h3 id='swapperreviews'>Swappr Reviews</h3>
<div  v-for="(rev,index) in reviews" :key='index'>
            <div class='reviews'>
            <div id='rating' >
              Rating: 
              {{rev.rating}}
            </div>
            <div id='review'>
              {{rev.review}}
              </div>
              </div>
            </div>
   
   

   <div class="container pb-cmnt-container">
      <b-dropdown  id="ddown1" text="Rate this Swappr" class="m-md-2">
    <b-dropdown-item @click='newRating(5)'>5</b-dropdown-item>
    <b-dropdown-item @click='newRating(4)'>4</b-dropdown-item>
    <b-dropdown-item @click='newRating(3)'>3</b-dropdown-item>
    <b-dropdown-item @click='newRating(2)'>2</b-dropdown-item>
    <b-dropdown-item @click='newRating(1)'>1</b-dropdown-item>
  </b-dropdown>
    <div class="row">
        <div class="col-md-12 col-md-offset-3">
            <div class="panel panel-info">
                <div class="panel-body">
                    <textarea v-model='review' placeholder="Write your comment here!" class="pb-cmnt-textarea"></textarea>
                    <form class="form-inline">
                        <button class="btn  pull-right" type="button" @click="postReview">Review</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
          </div>
        </div>
      </div>
    </div>
     
   
   
   
   
    <nav class="navbar" style="position: absolute; bottom: 0; height: 3em;">
      <div class="nav-contents container"> 
        <h6 class="created-by pt-1">Created by HoneyBadgerHackers</h6>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'userProfile',
  props: ['auth', 'authentication', 'userId'],
  data() {
    return {
      name: '',
      email: '',
      review: '',
      id: '',
      rating: '',
      description: '',
      tradeOffers: [],
      profileItems: [],
      reviews: [],
      acceptedTrade: {
        traderName: '',
        traderEmail: '',
      },
    };
  },
  created() {
    axios.get('/email')
        .then((email) => {
          this.id = email.data.id;
          axios.post('/email', { body: this.id })
        .then(() => {
          axios.get(`/getEmail/${this.id}`)
          .then((userEmail) => {
            this.email = userEmail.data;
            axios.get('/reviews')
            .then((reviews) => {
              this.reviews = reviews.data.reviews;
            });
          })
          .catch(err => console.log(err));
        });
        })
      .catch((err) => {
        console.log(err, 'err');
      });
  },
  methods: {
    newRating(num) {
      console.log(this.rating, 'before');
      this.rating = num;
      console.log(this.rating);
    },
    postReview() {
      const newReview = {
        reviewer: this.userId,
        reviewee: this.id,
        review: this.review,
        rating: this.rating,
      };
      axios.post('/reviews', newReview)
      .then((reviews) => {
        this.reviews = reviews.data.reviews;
        this.review = '';
      });
    },
    getUserItems() {
      const config = {
        headers: {
          id_user: this.userId,
        },
      };
      return axios.get('/items', config)
      .then(({ data: userItems }) => {
        this.profileItems = userItems;
      })
      .catch(err => console.error(err));
    },
    getTradeOffers() {
      if (!this.profileItems.length) {
        return;
      }
      const config = {
        headers: {
          id: this.userId,
          items: this.profileItems.map(item => item.id),
        },
      };
      axios.get('/users', config)
        .then((items) => {
          const sorted = items.data.map((offer) => {
            if (offer.id_user.toString() === this.userId) {
              return { myItem: offer.offered, theirItem: offer.desired };
            }
            return { myItem: offer.desired, theirItem: offer.offered };
          });
          this.tradeOffers = sorted;
        });
    },
    mainMenu() {
      this.$router.push({ path: '/main' });
    },
    removeListing(index) {
      const config = {
        headers: {
          id_item: this.profileItems[index].id,
        },
      };
      axios.delete('/items', config)
        .then(this.getUserItems)
          .then(this.getTradeOffers)
        .catch(err => console.error(err));
    },
    tradeView() {
      this.$refs.pendingTrades.show();
    },
  },
  mounted() {
    this.getUserItems()
    .then(this.getTradeOffers);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

.item-box {
  overflow-y: scroll;
  overflow-x: hidden;
}
.btn {
  margin: 1px;
}

li {
  display: inline-block;
}

</style>
