package main

import (
	"fmt"
	"log"
	"time"

	"os"
	"runtime"
	"runtime/pprof"

	"github.com/UedaTakeyuki/erapse"
	"github.com/syndtr/goleveldb/leveldb"
	//"github.com/boltdb/bolt"
)

var db *leveldb.DB

var world = []byte("world")

func put(key []byte, value []byte) (err error) {
	defer erapse.ShowErapsedTIme(time.Now())
	err = db.Put(key, value, nil)
	return
}

func delete(key []byte) (err error) {
	defer erapse.ShowErapsedTIme(time.Now())
	err = db.Delete(key, nil)
	return
}

func get(key []byte) (value []byte, err error) {
	defer erapse.ShowErapsedTIme(time.Now())
	value, err = db.Get(key, nil)
	return
}

func main() {
	f, _ := os.Create("mem.prof")
	runtime.GC()
	pprof.WriteHeapProfile(f)
	defer f.Close()

	var err error
	{
		//		log.Println("Open")
		//		defer erapse.ShowErapsedTIme(time.Now())
		db, err = leveldb.OpenFile("./leveldb.db", nil)
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
	log.Println("Put")
	if err = put(key, value); err != nil {
		log.Fatal(err)
	}
	if err = put(key2, value2); err != nil {
		log.Fatal(err)
	}

	// retrieve the data
	log.Println("Get")
	if valueRed, err := get(key); err != nil {
		log.Fatal(err)
	} else {
		log.Println("valueRed", valueRed)
		log.Println("value", value)
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

	log.Println("Delete")
	if err := delete(key); err != nil {
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
		log.Println("Put")
		if err = put([]byte(key), []byte(varvar)); err != nil {
			log.Fatal(err)
		}
		log.Println("Delete")
		if err = delete([]byte(key)); err != nil {
			log.Fatal(err)
		}
		i++
		time.Sleep(time.Second)
	}
}
