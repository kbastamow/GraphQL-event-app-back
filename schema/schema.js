const { events } = require("../testData");
const Event = require("../models/Event");
const Artist = require("../models/Artist");
const Genre = require("../models/Genre");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
} = require("graphql");


// Event Type
const EventType = new GraphQLObjectType({
  name: "Event",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    date: { type: GraphQLString },
    price: { type: GraphQLInt },
    image: { type: GraphQLString },
    artists: {
      //Add relationship
      type: new GraphQLList(ArtistType),
      resolve(parent, args) {
        //parent is this object
        return Promise.all(parent.artistIds.map((id) => Artist.findById(id))); //CHECK
      },
    },
  }),
});

// Artist Type
const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    bio: { type: GraphQLString },
    type: { type: GraphQLString }, //ENUM
    genres: {
      type: new GraphQLList(GenreType),
      resolve(parent, args) {
        return Promise.all(parent.genreIds.map((id) => Genre.findById(id)));
      },
    },
  }),
});

// Genre Type
const GenreType = new GraphQLObjectType({
  name: "Genre",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

// Setup for queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // FIELDS are the specific queries
    events: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return Event.find().sort({ date: 'asc' });
      },
    },
    event: {
      type: EventType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Event.findById(args.id);
      },
    },
    artists: {
      type: new GraphQLList(ArtistType),
      resolve(parent, args) {
        return Artist.find().sort({ name: 'asc' })
      }
    },
    artist: {
      type: ArtistType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Artist.findById(args.id);
      },
    },
    genres: {
      type: new GraphQLList(GenreType),
      resolve(parent, args) {
        return Genre.find().sort({ name: 'asc' });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addEvent: {
      type: EventType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLString },
        price: { type: GraphQLInt },
        image: { type: GraphQLString },
        artistIds: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        const event = await Event.create(args);
        console.log(event);
        return event;
      },
    },
    updateEvent: {
      type: EventType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        date: { type: GraphQLString },
        price: { type: GraphQLInt },
        image: { type: GraphQLString },
        artistIds: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        const request = {
          name: args.name,
          description: args.description,
          date: args.date,
          price: args.price,
          image: args.image,
          artistIds: args.artistIds,
        };
        const event = await Event.findByIdAndUpdate(args.id, request, {
          new: true,
        });
        console.log(event);
        return event;
      },
    },
    deleteEvent: {
      type: EventType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args) {
        const event = await Event.findByIdAndDelete(args.id, { new: true });
        console.log(event);
        return event;
      },
    },
    addGenres: {
      type: new GraphQLList(GenreType), //add several in an array
      args: {
        names: {
          type: new GraphQLList(GraphQLNonNull(GraphQLString)),
        },
      },
      async resolve(parent, { names }) {
        //NOTE POSITION OF ASYNC; Destructure names
        return await Promise.all(names.map((name) => Genre.create({ name }))); //NOTE: curly braces
      },
    },
    addGenre: {
      type: GenreType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(parent, args) {
        const genre = await Genre.create(args);
        console.log(genre);
        return genre;
      },
    },
    addArtist: {
      type: ArtistType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        bio: { type: GraphQLString },
        type: {
          type: new GraphQLEnumType({
            //enumtype allows to specify a set of options. Takes 2 args: name & values
            name: "AddArtistType",
            values: {
              solo: { value: "solo artist" }, //in query, you write the key
              band: { value: "band" },
              dj: { value: "DJ" }
            },
          }),
        },
        genreIds: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        const artist = await Artist.create(args);
        console.log(artist);
        return artist;
      },
    },
    updateArtist: {
      type: ArtistType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        bio: { type: GraphQLString },
        type: {
          type: new GraphQLEnumType({
            name: "UpdateArtistType",
            values: {
              solo: { value: "solo artist" },
              band: { value: "band" },
              dj: { value: "DJ" }
            },
          }),
        },
        genreIds: { type: new GraphQLList(GraphQLString) },
      },
      async resolve(parent, args) {
        const request = {
          name: args.name,
          bio: args.bio,
          type: args.type,
        };
        const artist = await Artist.findByIdAndUpdate(args.id, request, {
          new: true,
        });
        console.log(artist);
        return artist;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
