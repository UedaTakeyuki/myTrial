package main

import (
	"fmt"
	"log"
	"time"

	"github.com/UedaTakeyuki/erapse"
	"github.com/boltdb/bolt"
)

var world = []byte("world")

func main() {
	var err error
	var db *bolt.DB
	{
		//		log.Println("Open")
		//		defer erapse.ShowErapsedTIme(time.Now())
		db, err = bolt.Open("./bolt.db", 0644, nil)
	}
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	key := []byte("hello")
	value := []byte("Hello World!")

	// store some data
	err = db.Update(func(tx *bolt.Tx) error {
		log.Println("Update")
		defer erapse.ShowErapsedTIme(time.Now())
		bucket, err := tx.CreateBucketIfNotExists(world)
		if err != nil {
			return err
		}

		err = bucket.Put(key, value)
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	// retrieve the data
	err = db.View(func(tx *bolt.Tx) error {
		log.Println("View")
		defer erapse.ShowErapsedTIme(time.Now())
		bucket := tx.Bucket(world)
		if bucket == nil {
			return fmt.Errorf("Bucket %q not found!", world)
		}

		val := bucket.Get(key)
		fmt.Println(string(val))

		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	{
		// go string
		defer erapse.ShowErapsedTIme(time.Now())
		log.Println(db.GoString())
	}
	{
		// Info
		defer erapse.ShowErapsedTIme(time.Now())
		log.Println(db.Info())
	}

	err = db.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket(world)
		if bucket == nil {
			return fmt.Errorf("Bucket %q not found!", world)
		}

		{
			defer erapse.ShowErapsedTIme(time.Now())
			log.Println(bucket.Stats())
		}

		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

}
