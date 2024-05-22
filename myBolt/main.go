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
	key2 := []byte("げろげろ")
	value := []byte("Hello World!")
	value2 := []byte("げろげろ太郎！")

	// store some data
	err = db.Update(func(tx *bolt.Tx) error {
		log.Println("Update")
		defer erapse.ShowErapsedTIme(time.Now())
		bucket, err := tx.CreateBucketIfNotExists(world)
		if err != nil {
			return err
		}

		if err = bucket.Put(key, value); err != nil {
			return err
		}
		if err = bucket.Put(key2, value2); err != nil {
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

	err = db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket(world)
		if bucket == nil {
			return fmt.Errorf("Bucket %q not found!", world)
		}

		{
			log.Println("Status")
			defer erapse.ShowErapsedTIme(time.Now())
			log.Println(bucket.Stats())
		}

		{
			log.Println("Delete")
			defer erapse.ShowErapsedTIme(time.Now())
			if err := bucket.Delete(key); err != nil {
				log.Fatal(err)
			}
		}

		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	var i = 1
	const varvar = "123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678" +
		"123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 12345678"

	for {
		var key = fmt.Sprintf("key%d", i)
		log.Println(key)
		if err := db.Update(func(tx *bolt.Tx) error {
			defer erapse.ShowErapsedTIme(time.Now())
			bucket, err := tx.CreateBucketIfNotExists(world)
			if err != nil {
				return err
			}
			if err = bucket.Put([]byte(key), []byte(varvar)); err != nil {
				return err
			}

			return nil
		}); err != nil {
			log.Fatal(err)
		}
		if err := db.Update(func(tx *bolt.Tx) error {
			defer erapse.ShowErapsedTIme(time.Now())
			bucket, err := tx.CreateBucketIfNotExists(world)
			if err != nil {
				return err
			}
			if err = bucket.Delete([]byte(key)); err != nil {
				return err
			}

			return nil
		}); err != nil {
			log.Fatal(err)
		}
		i++
		time.Sleep(time.Second)
	}
}
