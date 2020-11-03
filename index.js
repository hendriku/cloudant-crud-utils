/* eslint-disable no-underscore-dangle */
const createDoc = (db, doc) => {
	db.insert(doc).catch(console.error)
}

const readPartition = (db, partition, onSuccess = () => {}, onError = () => {}) => {
	db.partitionedList(partition, { include_docs: true }, (error, data) => {
		if (error) {
			console.error(error)
			onError(error)
			return
		}
		onSuccess(data.rows.map(row => row.doc))
	})
}

const readAllDocs = (db, onSuccess = () => {}, onError = () => {}, config = undefined) => {
	if (config) {
		db.list(config, (error, data) => {
			if (error) {
				console.error(error)
				onError(error)
				return
			}
			onSuccess(data.rows.map(row => row.doc))
		})
	} else {
		db.list((error, data) => {
			if (error) {
				console.error(error)
				onError(error)
				return
			}
			onSuccess(data.rows.map(el => el.id))
		})
	}
}

/** Supports partitioning */
const readDoc = (db, id, onSuccess = () => {}, onError = () => {}) => {
	db.get(id, (error, doc) => {
		if (error) {
			console.error(error)
			onError(error)
			return
		}
		onSuccess(doc)
	})
}

/** Supports partitioning */
const updateDoc = (db, doc) => {
	db.insert(doc).catch(console.error)
}

const deleteDoc = (db, id, onSuccess = () => {}, onError = () => {}) => {
	db.get(id, (error, doc) => {
		if (error) {
			console.error(error)
			onError(error)
			return
		}

		db.destroy(id, doc._rev)
		onSuccess()
	})
}
const deleteAllDocs = (db, onSuccess = () => {}, onError = () => {}) => {
	db.list((error, data) => {
		if (error) {
			console.error(error)
			onError(error)
			return
		}
		data.rows.forEach(doc => {
			db.destroy(doc.id, doc.value.rev)
		})
		onSuccess()
	})
}

module.exports = {
	createDoc,
	readAllDocs,
	readPartition,
	readDoc,
	updateDoc,
	deleteDoc,
	deleteAllDocs
}
