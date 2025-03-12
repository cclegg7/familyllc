package com.familyllc.recipemanager.entity

import jakarta.persistence.*

@Entity
@Table(name = "ingredients")
data class Ingredient(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var name: String,
    
    var quantity: String? = null,
    
    var unit: String? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    var recipe: Recipe? = null
)
