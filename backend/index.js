// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors=require('cors')

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({}))
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://simrantandon2801:Simran_786@cluster0.sssfqqs.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const City = mongoose.model('City', {
  name: String,
	distance: Number,
	imageUrl: { type: String, default: '' }
});

const Vehicle = mongoose.model('Vehicle', {
  type: String,
  range: Number,
	count: Number,
	imageUrl: { type: String, default: '' }
});
const copSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City', // Reference to the City model
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle', // Reference to the Vehicle model
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

const Cop = mongoose.model('Cop', copSchema);
const FugitiveLocation = mongoose.model('FugitiveLocation', {
  city: String,
});
app.get('/cop/:name', async (req, res) => {
    try {
		const { name } = req.params;
		console.log(name)
        // Find the cop by name in the database
        const cop = await Cop.findOne({ name });
        if (!cop) {
            return res.status(404).json({ error: 'Cop not found' });
        }
        // If cop is found, send the imageUrl in the response
        res.json({ imageUrl: cop.imageUrl });
    } catch (error) {
        console.error('Error fetching cop image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/cities', async (req, res) => {
  try {
	  const cities = await City.find();
	  console.log(cities,'ck')
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// app.post('/capture', async (req, res) => {
//     const { cop1City, cop1Vehicle, cop2City, cop2Vehicle, cop3City, cop3Vehicle } = req.body;

//     try {
//         // Simulate the fugitive's location randomly
//         const cities = ['Yapkashnagar', 'Lihaspur', 'Narmis City', 'Shekharvati', 'Nuravgram'];
//         const fugitiveLocation = cities[Math.floor(Math.random() * cities.length)];

//         const cops = [
//             { city: cop1City, vehicle: cop1Vehicle },
//             { city: cop2City, vehicle: cop2Vehicle },
//             { city: cop3City, vehicle: cop3Vehicle },
//         ];

//         let capturedCops = [];
//         for (const cop of cops) {
//             const city = await City.findOne({ name: cop.city });
//             const vehicle = await Vehicle.findOne({ type: cop.vehicle });
// 			if (city && vehicle && city.distance <= vehicle.range && fugitiveLocation === cop.city) {
// 				console.log(city._id)
// 				const capturedCop = await Cop.findOne({ city: city._id, vehicle: vehicle._id });
// 				console.log(capturedCop,'cops')
//                 if (capturedCop) {
// 					capturedCops.push({ name: capturedCop.name, photo: capturedCop.image });
// 					console.log(capturedCop,'csj')
//                 }
//             }
//         }

//         if (capturedCops.length > 0) {
//             res.json({ success: true, capturedCops });
//         } else {
//             res.json({ success: false });
//         }
//     } catch (error) {
//         console.error('Error capturing fugitive:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.post('/capture', async (req, res) => {
	const { cop1City, cop1Vehicle, cop2City, cop2Vehicle, cop3City, cop3Vehicle } = req.body;
	
	try {
	  // Simulate the fugitive's location randomly
	  const cities = ['Yapkashnagar', 'Lihaspur', 'Narmis City', 'Shekharvati', 'Nuravgram'];
	  const fugitiveLocation = cities[Math.floor(Math.random() * cities.length)];
  
	  const cops = [
		{ city: cop1City, vehicle: cop1Vehicle },
		{ city: cop2City, vehicle: cop2Vehicle },
		{ city: cop3City, vehicle: cop3Vehicle },
	  ];
  
	  let found = false;
	  for (const cop of cops) {
		const city = await City.findOne({ name: cop.city });
		const vehicle = await Vehicle.findOne({ type: cop.vehicle });
		if (city.distance <= vehicle.range && fugitiveLocation === cop.city) {
			found = true;
			const h = await Cop.find({});
			
			
		  res.json({ success: true, cop });
		  break;
		}
	  }
  
	  if (!found) {
		res.json({ success: false });
	  }
	} catch (error) {
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  

// app.post('/capture', async (req, res) => {
//   const { cop1City, cop1Vehicle, cop2City, cop2Vehicle, cop3City, cop3Vehicle } = req.body;
// 	console.log(req.body);
//   try {
//     const fugitiveLocation = await FugitiveLocation.findOne();
// console.log(fugitiveLocation,'location')
//     const cops = [
//       { city: cop1City, vehicle: cop1Vehicle },
//       { city: cop2City, vehicle: cop2Vehicle },
//       { city: cop3City, vehicle: cop3Vehicle },
//     ];
// console.log(cops,'cops')
//     let found = false;
//     for (const cop of cops) {
//       const city = await City.findOne({ name: cop.city });
//       const vehicle = await Vehicle.findOne({ type: cop.vehicle });
//       if (city.distance <= vehicle.range && fugitiveLocation.city === cop.city) {
// 		  found = true;
// 		  console.log(success,'kk')
//         res.json({ success: true, cop });
//         break;
//       }
//     }

//     if (!found) {
//       res.json({ success: false });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
// Uncomment the lines
// async function seedCities() {
//     try {
//         await City.updateMany(
//             {},
//             { $set: { imageUrl: '' } }, // Initialize imageUrl field with an empty string for all documents
//             { multi: true }
//         );
//         console.log('Cities imageUrl field initialized successfully.');

//         // Now update each document with respective image URL
//         await City.updateMany(
//             { name: { $in: ['Yapkashnagar', 'Lihaspur', 'Narmis City', 'Shekharvati', 'Nuravgram'] } },
//             { $set: { imageUrl: '' } } // Clear imageUrl first
//         );
//         await City.updateOne(
//             { name: 'Yapkashnagar' },
//             { $set: { imageUrl: 'https://i.ibb.co/NNr7JJ0/image5.png' } }
//         );
//         await City.updateOne(
//             { name: 'Lihaspur' },
//             { $set: { imageUrl: 'https://i.ibb.co/gRQLMxs/image10.png' } }
//         );
//         await City.updateOne(
//             { name: 'Narmis City' },
//             { $set: { imageUrl: 'https://i.ibb.co/bby5Jww/image9.png' } }
//         );
//         await City.updateOne(
//             { name: 'Shekharvati' },
//             { $set: { imageUrl: 'https://i.ibb.co/w74FVY0/image6.png' } }
//         );
//         await City.updateOne(
//             { name: 'Nuravgram' },
//             { $set: { imageUrl: 'https://i.ibb.co/RCFmMc9/image3.png' } }
//         );

//         console.log('Cities imageUrl updated successfully.');
//     } catch (error) {
//         console.error('Error seeding cities:', error);
//     }
// }

// async function seedVehicles() {
//     try {
//         await Vehicle.updateMany(
//             {},
//             { $set: { imageUrl: '' } }, // Initialize imageUrl field with an empty string for all documents
//             { multi: true }
//         );
//         console.log('Vehicles imageUrl field initialized successfully.');

//         // Now update each document with respective image URL
//         await Vehicle.updateOne(
//             { type: 'EV Bike' },
//             { $set: { imageUrl: 'https://i.ibb.co/hF5mtP4/image7.png' } }
//         );
//         await Vehicle.updateOne(
//             { type: 'EV Car' },
//             { $set: { imageUrl: 'https://i.ibb.co/6mhhyv5/image11.png' } }
//         );
//         await Vehicle.updateOne(
//             { type: 'EV SUV' },
//             { $set: { imageUrl: 'https://i.ibb.co/WP3rrSs/image12.png' } }
//         );

//         console.log('Vehicles imageUrl updated successfully.');
//     } catch (error) {
//         console.error('Error seeding vehicles:', error);
//     }
// }
// async function seedCops() {
//     try {
//         // Initialize imageUrl field with an empty string for all documents
//         await Cop.updateMany({}, { $set: { imageUrl: '' } }, { multi: true });
//         console.log('Cops imageUrl field initialized successfully.');

//         // Update each document with respective image URL
//         await Cop.updateOne(
//             { name: 'Cop1' }, // Specify the criteria to match the cop document
//             { $set: { imageUrl: 'https://i.ibb.co/xmP2WfM/image8.png' } } // Provide the URL of the image for Cop1
//         );

//         await Cop.updateOne(
//             { name: 'Cop2' },
//             { $set: { imageUrl: 'https://i.ibb.co/0qbTk9P/image4.png' } }
//         );

//         await Cop.updateOne(
//             { name: 'Cop3' },
//             { $set: { imageUrl: 'https://i.ibb.co/xsGwgjg/image2.png' } }
//         );

//         console.log('Cops imageUrl updated successfully.');
//     } catch (error) {
//         console.error('Error seeding cops:', error);
//     }
// }

async function seedData() {
    // await seedCities();
	// await seedVehicles();
	// await seedCops();
}

// seedData();



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
