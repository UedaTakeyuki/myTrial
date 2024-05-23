package main

import (
	"fmt"
	"log"
	"time"

	"os"
	"runtime"
	"runtime/pprof"

	"github.com/UedaTakeyuki/erapse"
	badger "github.com/dgraph-io/badger/v4"
	//"github.com/boltdb/bolt"
)

var world = []byte("world")

func main() {
	f, _ := os.Create("mem.prof")
	runtime.GC()
	pprof.WriteHeapProfile(f)
	defer f.Close()

	var err error
	var db *badger.DB
	{
		//		log.Println("Open")
		//		defer erapse.ShowErapsedTIme(time.Now())
		db, err = badger.Open(badger.DefaultOptions("./badger.db"))
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
	err = db.Update(func(txn *badger.Txn) error {
		log.Println("Update")
		defer erapse.ShowErapsedTIme(time.Now())
		if err = txn.Set(key, value); err != nil {
			return err
		}
		if err = txn.Set(key2, value2); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	// retrieve the data
	err = db.View(func(txn *badger.Txn) error {
		log.Println("View")
		defer erapse.ShowErapsedTIme(time.Now())

		if item, err := txn.Get(key); err != nil {
			return err
		} else {
			var valNot, valCopy []byte
			err := item.Value(func(val []byte) error {
				// This func with val would only be called if item.Value encounters no error.

				// Accessing val here is valid.
				fmt.Printf("The answer is: %s\n", val)

				// Copying or parsing val is valid.
				valCopy = append([]byte{}, val...)

				// Assigning val slice to another variable is NOT OK.
				valNot = val // Do not do this.
				return nil
			})
			if err != nil {
				return err
			}

			// DO NOT access val here. It is the most common cause of bugs.
			fmt.Printf("NEVER do this. %s\n", valNot)

			// You must copy it to use it outside item.Value(...).
			fmt.Printf("The answer is: %s\n", valCopy)

			// Alternatively, you could also use item.ValueCopy().
			valCopy, err = item.ValueCopy(nil)

			fmt.Printf("The answer is: %s\n", valCopy)

		}

		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	{
		// go string
		/*
			defer erapse.ShowErapsedTIme(time.Now())
			log.Println(db.GoString())
		*/
	}
	{
		// Info
		/*
			defer erapse.ShowErapsedTIme(time.Now())
			log.Println(db.Info())
		*/
	}

	err = db.Update(func(txn *badger.Txn) error {
		{
			log.Println("Delete")
			defer erapse.ShowErapsedTIme(time.Now())
			if err := txn.Delete(key); err != nil {
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
		if err := db.Update(func(txn *badger.Txn) error {
			defer erapse.ShowErapsedTIme(time.Now())
			if err = txn.Set([]byte(key), []byte(varvar)); err != nil {
				return err
			}

			return nil
		}); err != nil {
			log.Fatal(err)
		}
		if err := db.Update(func(txn *badger.Txn) error {
			defer erapse.ShowErapsedTIme(time.Now())
			if err = txn.Delete([]byte(key)); err != nil {
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
