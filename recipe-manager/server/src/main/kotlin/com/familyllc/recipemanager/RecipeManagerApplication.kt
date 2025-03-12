package com.familyllc.recipemanager

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class RecipeManagerApplication

fun main(args: Array<String>) {
    runApplication<RecipeManagerApplication>(*args)
}
